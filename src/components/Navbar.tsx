
import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [balance, setBalance] = useState(500); // Mock wallet balance

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-astro-purple/20">
              <Plus size={12} />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>US</AvatarFallback>
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
          onClick={() => window.location.href = '/login'} 
          className="border-astro-purple/30 hover:bg-astro-purple/10"
        >
          Login
        </Button>
        <Button 
          onClick={() => window.location.href = '/signup'} 
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
