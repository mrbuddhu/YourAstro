
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, MessageCircle, Info, PhoneOff, Phone as PhoneIcon, Mic, MicOff } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { mockAstrologers } from "@/data/mockAstrologers";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from '@tanstack/react-query';

interface CallSession {
  id: string;
  astrologer_id: string;
  user_id: string;
  start_time: string | null;
  end_time: string | null;
  status: 'waiting' | 'active' | 'ended' | 'missed';
  duration_seconds: number;
}

const CallPage = () => {
  const { astrologerId } = useParams();
  const astrologer = mockAstrologers.find(a => a.id === astrologerId);
  const [callStatus, setCallStatus] = useState<'waiting' | 'active' | 'ended' | 'missed'>('waiting');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [walletBalance, setWalletBalance] = useState(500);
  const [isMuted, setIsMuted] = useState(false);
  const [callSessionId, setCallSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
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
  
  // Create a new call session
  const createCallSession = async () => {
    if (!userId || !astrologer) return null;
    
    const newSession: Omit<CallSession, 'id'> = {
      astrologer_id: astrologer.id,
      user_id: userId,
      start_time: null,
      end_time: null,
      status: 'waiting',
      duration_seconds: 0
    };
    
    const { data, error } = await supabase
      .from('call_sessions')
      .insert(newSession)
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating call session:', error);
      toast({
        title: "Error starting call",
        description: "We couldn't connect your call. Please try again.",
        variant: "destructive",
      });
      return null;
    }
    
    return data.id;
  };
  
  // Update call session
  const updateCallSession = async (id: string, updates: Partial<CallSession>) => {
    const { error } = await supabase
      .from('call_sessions')
      .update(updates)
      .eq('id', id);
      
    if (error) {
      console.error('Error updating call session:', error);
    }
  };
  
  // Start call mutation
  const startCallMutation = useMutation({
    mutationFn: createCallSession,
    onSuccess: (sessionId) => {
      if (sessionId) {
        setCallSessionId(sessionId);
        startCall();
      }
    },
  });
  
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
              const newBalance = prev - (astrologer?.pricePerMin || 0);
              
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
  
  // Start call
  const startCall = () => {
    setIsRunning(true);
    setCallStatus('active');
    
    // Update call session in Supabase
    if (callSessionId) {
      updateCallSession(callSessionId, {
        start_time: new Date().toISOString(),
        status: 'active'
      });
    }
    
    toast({
      title: "Call Started",
      description: `You are now connected with ${astrologer?.name}`,
    });
  };
  
  // End call
  const endCall = () => {
    setIsRunning(false);
    setCallStatus('ended');
    
    // Update call session in Supabase
    if (callSessionId) {
      updateCallSession(callSessionId, {
        end_time: new Date().toISOString(),
        status: 'ended',
        duration_seconds: timer
      });
    }
    
    toast({
      title: "Call Ended",
      description: `Your call with ${astrologer?.name} has ended.`,
    });
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "Your microphone is now active." : "Your microphone is now muted.",
    });
  };
  
  // Set up real-time channel for call status updates
  useEffect(() => {
    if (!callSessionId) return;
    
    const channel = supabase
      .channel(`call_${callSessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Current state:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        
        // If astrologer leaves, end call
        if (key.includes(astrologerId || '') && callStatus === 'active') {
          endCall();
          toast({
            title: "Call Disconnected",
            description: `${astrologer?.name} has disconnected from the call.`,
            variant: "destructive",
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && userId) {
          // Track user presence
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [callSessionId, astrologerId, callStatus, userId]);

  if (!astrologer) {
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
        <div className="max-w-md mx-auto">
          {/* Call header */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/astrologers">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Voice Call</h1>
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
          
          <Card className="cosmic-card mb-4">
            {/* Call info */}
            <div className="bg-muted/30 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} />
                <span>Time: {formatTime(timer)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span>
                  Balance: <span className="text-astro-gold">₹{walletBalance}</span>
                </span>
              </div>
            </div>
            
            {/* Call display */}
            <div className="p-10 flex flex-col items-center justify-center">
              <Avatar className="h-32 w-32 border-4 border-astro-purple/40 mb-4">
                <AvatarImage src={astrologer.image} alt={astrologer.name} />
                <AvatarFallback className="bg-astro-purple/20 text-3xl">
                  {astrologer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-bold mb-2">{astrologer.name}</h2>
              
              <Badge className={`mb-6 ${callStatus === 'waiting' ? 'bg-amber-500' : callStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                {callStatus === 'waiting' ? 'Connecting...' : callStatus === 'active' ? 'In Call' : 'Call Ended'}
              </Badge>
              
              {callStatus !== 'ended' && (
                <div className="text-center mb-4">
                  <p className="text-foreground/70">
                    {callStatus === 'waiting' 
                      ? 'Please wait while we connect you...' 
                      : `You're speaking with ${astrologer.name}`
                    }
                  </p>
                </div>
              )}
              
              {callStatus === 'ended' && (
                <div className="text-center mb-4">
                  <p className="font-medium">Call Duration: {formatTime(timer)}</p>
                  <p className="text-foreground/70 mt-1">
                    Amount charged: ₹{Math.ceil(timer / 60) * astrologer.pricePerMin}
                  </p>
                </div>
              )}
            </div>
            
            <CardContent className="p-6 flex gap-4 justify-center">
              {callStatus === 'waiting' && !isRunning ? (
                <Button 
                  onClick={() => startCallMutation.mutate()}
                  className="bg-green-500 hover:bg-green-600 px-6"
                >
                  <PhoneIcon size={20} className="mr-2" />
                  Start Call
                </Button>
              ) : callStatus === 'active' ? (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-16 w-16 rounded-full border-2"
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                  </Button>
                  
                  <Button 
                    onClick={endCall}
                    variant="destructive" 
                    size="icon"
                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                  >
                    <PhoneOff size={24} />
                  </Button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Button 
                    className="bg-astro-purple hover:bg-astro-lightPurple px-6"
                    asChild
                  >
                    <Link to="/astrologers">
                      Find Astrologer
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-astro-purple/30 hover:bg-astro-purple/10 px-6"
                    asChild
                  >
                    <Link to={`/chat/${astrologer.id}`}>
                      <MessageCircle size={20} className="mr-2" />
                      Chat Instead
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Rate card */}
          {callStatus !== 'ended' && (
            <div className="text-center text-sm text-foreground/70">
              <p>You will be charged ₹{astrologer.pricePerMin} per minute of consultation.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CallPage;
