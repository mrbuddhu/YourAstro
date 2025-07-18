import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, ArrowLeft, Clock, Phone, Info, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  chat_session_id: string;
}

interface ChatSession {
  id: string;
  astrologer_id: string;
  user_id: string;
  start_time: Date | null;
  end_time: Date | null;
  status: 'active' | 'ended';
  duration_seconds: number;
}

const ChatPage = () => {
  const { astrologerId } = useParams();
  const [astrologer, setAstrologer] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [walletBalance, setWalletBalance] = useState(500);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch astrologer data
  useEffect(() => {
    const fetchAstrologer = async () => {
      if (!astrologerId) return;
      
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', astrologerId)
        .eq('user_type', 'astrologer')
        .single();
        
      if (error) {
        setError('Failed to load astrologer profile.');
        toast({
          title: "Error",
          description: "Could not load astrologer profile. Please try again.",
          variant: "destructive",
        });
      } else {
        setAstrologer(data);
      }
      
      setLoading(false);
    };
    
    fetchAstrologer();
  }, [astrologerId]);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setTimer(prevTime => {
          const newTime = prevTime + 1;
          
          // Deduct from wallet every minute
          if (newTime % 60 === 0) {
            setWalletBalance(prev => {
              const newBalance = prev - (astrologer?.price_per_min || 0);
              
              // Check if balance is low
              if (newBalance < 100) {
                toast({
                  title: "Low Balance Warning",
                  description: "Your wallet balance is running low. Please add funds to continue.",
                  variant: "destructive",
                });
              }
              
              return newBalance;
            });
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, astrologer]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Subscribe to messages and load existing messages
  useEffect(() => {
    if (!chatSessionId) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', chatSessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history.",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${chatSessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_session_id=eq.${chatSessionId}`,
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatSessionId]);

  // Create chat session
  const createChatSession = async () => {
    if (!userId || !astrologer) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          astrologer_id: astrologer.id,
          user_id: userId,
          status: 'active',
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat session:', error);
        toast({
          title: "Error Starting Chat",
          description: "We couldn't start the chat session. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Error Starting Chat",
        description: "We couldn't start the chat session. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!chatSessionId || !userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_session_id: chatSessionId,
          sender_id: userId,
          content: content
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle message submit
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage("");
  };

  // Toggle chat session
  const toggleChatSession = async () => {
    if (!isRunning) {
      const session = await createChatSession();
      if (!session) return;

      setChatSessionId(session.id);
      setIsRunning(true);

      // Send welcome message
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_session_id: session.id,
          sender_id: astrologer?.id || 'unknown',
          content: `Hello, I'm ${astrologer?.full_name}. How can I assist you with your cosmic journey today?`
        });

      if (error) {
        console.error('Error sending welcome message:', error);
        toast({
          title: "Error",
          description: "Failed to send welcome message",
          variant: "destructive"
        });
      }
    } else {
      if (chatSessionId) {
        // Unsubscribe from real-time updates
        await supabase.channel(`chat_${chatSessionId}`).unsubscribe();

        const { error } = await supabase
          .from('chat_sessions')
          .update({
            status: 'ended',
            end_time: new Date().toISOString(),
            duration_seconds: timer
          })
          .eq('id', chatSessionId);

        if (error) {
          console.error('Error ending chat session:', error);
          toast({
            title: "Error",
            description: "Failed to end chat session",
            variant: "destructive"
          });
          return;
        }
      }

      setIsRunning(false);
      setChatSessionId(null);
      setMessages([]);
      toast({
        title: "Chat Ended",
        description: "Your chat session has been saved to your history.",
      });
    }
  };
  
  // Send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === "" || !chatSessionId) return;
    
    // Add user message
    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        chat_session_id: chatSessionId,
        sender_id: userId,
        content: newMessage
      });

    if (sendError) {
      console.error('Error sending message:', sendError);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setNewMessage("");
    
    // Simulate astrologer response after delay
    setTimeout(async () => {
      const responses = [
        "I see Saturn's influence in your query. Let me analyze this further...",
        "The alignment of Venus suggests positive energy in your relationships.",
        "Mercury retrograde might be affecting your communication. Here's what I recommend...",
        "Your natal chart reveals interesting patterns related to your question.",
        "Based on your cosmic energy, I sense there are opportunities ahead for you.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const { error: responseError } = await supabase
        .from('messages')
        .insert({
          chat_session_id: chatSessionId,
          sender_id: astrologer?.id || 'unknown',
          content: randomResponse
        });

      if (responseError) {
        console.error('Error sending astrologer response:', responseError);
      }
    }, 1500);
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Loading Astrologer...</h1>
        </div>
      </>
    );
  }
  
  if (error || !astrologer) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Astrologer Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the astrologer you're looking for.</p>
          <Button asChild>
            <Link to="/astrologers">Browse Astrologers</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Chat header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/astrologers">
                  <ArrowLeft />
                </Link>
              </Button>
              <Avatar className="h-10 w-10 border-2 border-astro-purple/30">
                <AvatarImage src={astrologer.avatar_url || "/placeholder.svg"} alt={astrologer.full_name} />
                <AvatarFallback className="bg-astro-purple/20">
                  {astrologer.full_name?.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{astrologer.full_name}</h2>
                  {astrologer.is_online && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-xs">Online</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground/70">
                  {astrologer.experience || 0} years • {(astrologer.languages || []).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-astro-purple/30 hover:bg-astro-purple/10"
                asChild
              >
                <Link to={`/call/${astrologer.id}`}>
                  <Phone size={16} className="mr-1" />
                  Call
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-astro-purple/30 hover:bg-astro-purple/10"
                asChild
              >
                <Link to={`/astrologer/${astrologer.id}`}>
                  <Info size={16} className="mr-1" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
          
          <Card className="cosmic-card mb-4 overflow-hidden">
            {/* Chat session info */}
            <div className="bg-muted/30 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} />
                <span>Time: {formatTime(timer)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  Rate: <span className="text-astro-gold">₹{astrologer.price_per_min || 0}</span>/min
                </span>
                <span>•</span>
                <span>
                  Balance: <span className="text-astro-gold">₹{walletBalance}</span>
                </span>
              </div>
            </div>
            
            {/* Chat area */}
            <div 
              ref={chatContainerRef}
              className="h-[60vh] overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 && !isRunning ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-astro-purple/20 flex items-center justify-center">
                    <Send size={24} className="text-astro-purple" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Start Your Consultation</h3>
                  <p className="text-foreground/70 max-w-md">
                    Click the 'Start Chat' button below to begin your session with {astrologer.full_name}.
                    Your wallet will be charged ₹{astrologer.price_per_min || 0} per minute.
                  </p>
                </div>
              ) : (
                <>
                  {/* System message at the start of chat */}
                  {messages.length > 0 && (
                    <div className="bg-muted/20 rounded-lg p-3 text-center text-sm text-foreground/70 mb-6">
                      <p>Chat started with {astrologer.full_name}</p>
                      <p>Session rate: ₹{astrologer.price_per_min || 0}/minute</p>
                    </div>
                  )}
                  
                  {/* Chat messages */}
                  {messages.map(message => {
                    const isUser = message.sender_id === userId;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${isUser ? 'bg-astro-purple text-white' : 'bg-muted'} rounded-2xl px-4 py-2`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-foreground/50'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            
            {/* Warning for low balance */}
            {walletBalance < 50 && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm">
                  <span className="font-medium">Low balance warning!</span> Please add funds to your wallet to continue the consultation.
                </p>
                <Button 
                  size="sm" 
                  className="ml-auto bg-astro-purple hover:bg-astro-lightPurple"
                  asChild
                >
                  <Link to="/wallet">Add Funds</Link>
                </Button>
              </div>
            )}
            
            {/* Chat input */}
            <Separator />
            <CardContent className="p-4">
              {!isRunning ? (
                <Button
                  onClick={toggleChatSession}
                  className="w-full star-button"
                  disabled={!astrologer.is_online}
                >
                  {astrologer.is_online ? "Start Chat" : "Astrologer Offline"}
                </Button>
              ) : (
                <form onSubmit={handleMessageSubmit} className="flex items-center gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="celestial-input flex-1"
                    disabled={!isRunning}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-astro-purple hover:bg-astro-lightPurple"
                    disabled={!isRunning || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* Session control */}
          {isRunning && (
            <div className="text-center">
              <Button 
                onClick={toggleChatSession}
                variant="outline" 
                className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                End Session
              </Button>
              <p className="mt-2 text-xs text-foreground/70">
                Your wallet will be charged ₹{astrologer.price_per_min || 0} per minute of consultation.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
