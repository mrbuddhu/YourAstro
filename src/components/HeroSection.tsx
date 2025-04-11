
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] overflow-hidden flex items-center">
      {/* Decorative stars */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="astro-gradient-text">Discover Your Cosmic Path</span>
            <span className="block mt-2">with Expert Astrologers</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-10">
            Connect with professional astrologers for personalized readings
            that illuminate your journey through the stars.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="star-button text-lg px-8 py-6"
              asChild
            >
              <Link to="/astrologers">
                <Search className="mr-2 h-5 w-5" />
                Find Your Astrologer
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-lg border-astro-purple/30 hover:bg-astro-purple/10 px-8 py-6"
              asChild
            >
              <Link to="/horoscope">
                Daily Horoscope
              </Link>
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="cosmic-card p-6">
              <h3 className="font-bold text-2xl text-astro-purple">500+</h3>
              <p className="text-sm text-foreground/70">Expert Astrologers</p>
            </div>
            
            <div className="cosmic-card p-6">
              <h3 className="font-bold text-2xl text-astro-purple">24/7</h3>
              <p className="text-sm text-foreground/70">Available Support</p>
            </div>
            
            <div className="cosmic-card p-6">
              <h3 className="font-bold text-2xl text-astro-purple">10K+</h3>
              <p className="text-sm text-foreground/70">Daily Consultations</p>
            </div>
            
            <div className="cosmic-card p-6">
              <h3 className="font-bold text-2xl text-astro-purple">4.8</h3>
              <p className="text-sm text-foreground/70">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
