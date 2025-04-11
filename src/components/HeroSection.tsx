
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Star, Sun, Moon, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] overflow-hidden flex items-center bg-gradient-to-b from-background to-background/95">
      {/* Mandala Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('/backgrounds/mandala-pattern.svg')] bg-repeat bg-center" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated stars */}
        {Array.from({ length: 50 }).map((_, index) => {
          const size = Math.random() > 0.8 ? 'star-lg' : Math.random() > 0.5 ? 'star-md' : 'star-sm';
          return (
            <div
              key={index}
              className={`star ${size}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          );
        })}
      </div>
      
      {/* Translucent planets/orbs */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full bg-astro-purple/10 animate-float" 
           style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 -left-16 w-48 h-48 rounded-full bg-astro-lightPurple/10 animate-float"
           style={{ animationDelay: '2s' }} />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 opacity-20 bg-[url('/backgrounds/om-symbol.svg')] bg-contain bg-no-repeat bg-center" />
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="astro-gradient-text">Your Future,</span>
              <span className="block mt-2">Our Expertise</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-10">
              Connect with India's most trusted astrologers and find
              answers to all your life's questions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="star-button text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to="/astrologers" className="flex items-center">
                <PhoneCall className="mr-2 h-5 w-5" />
                Call Now
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-lg border-orange-500/30 hover:bg-orange-500/10 px-8 py-6 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to="/chat" className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Chat Now
              </Link>
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="cosmic-card p-6 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm">
              <div className="flex justify-center mb-2">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">500+</h3>
              <p className="text-sm text-foreground/70">Expert Astrologers</p>
            </div>
            
            <div className="cosmic-card p-6 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm">
              <div className="flex justify-center mb-2">
                <Sun className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">24/7</h3>
              <p className="text-sm text-foreground/70">Service Available</p>
            </div>
            
            <div className="cosmic-card p-6 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm">
              <div className="flex justify-center mb-2">
                <Moon className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">10K+</h3>
              <p className="text-sm text-foreground/70">Daily Consultations</p>
            </div>
            
            <div className="cosmic-card p-6 border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm">
              <div className="flex justify-center mb-2">
                <PhoneCall className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">4.8</h3>
              <p className="text-sm text-foreground/70">Client Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
