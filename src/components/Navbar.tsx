import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, User, LogOut, Plus } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUser(session.user);
        // Fetch wallet balance
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching wallet balance:', error);
        } else if (profile) {
          setBalance(profile.wallet_balance || 0);
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUser(session.user);
        // Fetch wallet balance
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setBalance(profile.wallet_balance || 0);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUser(null);
      setBalance(0);
      navigate('/login');
      
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddFunds = () => {
    navigate('/wallet/add-funds');
  };

  const NavLinks = () => (
    <div className="flex items-center gap-6">
      <Link to="/astrologers" className="text-foreground hover:text-astro-purple transition-colors">
        Astrologers
      </Link>
      <Link to="/horoscope" className="text-foreground hover:text-astro-purple transition-colors">
        Daily Horoscope
      </Link>
      <Link to="/about" className="text-foreground hover:text-astro-purple transition-colors">
        About Us
      </Link>
    </div>
  );

  const AuthSection = () => {
    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-4">
          <div className="bg-muted px-4 py-1.5 rounded-full flex items-center gap-1.5 text-sm">
            <span className="text-astro-gold">₹</span>
            <span>{balance}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-astro-purple/20"
              onClick={handleAddFunds}
            >
              <Plus size={12} />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{user?.user_metadata?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User size={14} />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                <LogOut size={14} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
    
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/login')} 
          className="border-astro-purple/30 hover:bg-astro-purple/10"
        >
          Login
        </Button>
        <Button 
          onClick={() => navigate('/signup')} 
          className="bg-gradient-to-r from-astro-purple to-astro-lightPurple hover:opacity-90"
        >
          Sign Up
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-accent/10 h-16">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-astro-purple/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-astro-purple to-astro-lightPurple rounded-full flex items-center justify-center">
                <span className="text-white font-bold">123</span>
              </div>
            </div>
            <span className="font-bold text-xl astro-gradient-text">123Astro</span>
          </Link>
          {!isMobile && <NavLinks />}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && <AuthSection />}
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex flex-col py-6 gap-6">
                    <NavLinks />
                  </div>
                  <div className="py-6 border-t">
                    <AuthSection />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
