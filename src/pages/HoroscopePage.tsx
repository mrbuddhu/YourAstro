import React from 'react';
import { Button } from "@/components/ui/button";
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HoroscopePage = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 min-h-[calc(100vh-4rem)]">
        <div className="max-w-2xl mx-auto py-24 text-center">
          <div className="mb-8">
            <Construction size={64} className="mx-auto text-astro-purple animate-bounce" />
          </div>
          
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-astro-purple to-astro-lightPurple text-transparent bg-clip-text">
              Daily Horoscope Coming Soon
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12">
            We're working hard to bring you personalized daily horoscope readings. Stay tuned for cosmic insights tailored just for you!
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline" className="border-astro-purple/30 hover:bg-astro-purple/10">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-astro-purple to-astro-lightPurple hover:opacity-90">
              <Link to="/astrologers">
                Browse Astrologers
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HoroscopePage;