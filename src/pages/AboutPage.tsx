import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Coming Soon Section */}
          <div className="cosmic-card p-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-astro-purple/20 flex items-center justify-center">
              <Construction className="h-8 w-8 text-astro-purple" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              <span className="astro-gradient-text">Coming Soon</span>
            </h1>
            
            <p className="text-lg text-foreground/70 mb-8">
              We're working on creating an amazing story about our journey in astrology. 
              Check back soon to learn more about 123Astro and our mission to connect you 
              with the cosmic guidance you seek.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline" className="border-astro-purple/30 hover:bg-astro-purple/10">
                <Link to="/">Return Home</Link>
              </Button>
              <Button asChild className="star-button">
                <Link to="/astrologers">Explore Astrologers</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage; 