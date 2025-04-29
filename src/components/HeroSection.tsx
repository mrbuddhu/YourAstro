import React from 'react';
import { Button } from "@/components/ui/button";
import { PhoneCall, Sparkles, Star, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] overflow-hidden flex items-center bg-gradient-to-b from-orange-50 to-purple-50">
      {/* Ethnic Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-5 bg-[url('/backgrounds/mandala-pattern.svg')] bg-repeat bg-center" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-br from-orange-200/20 to-purple-200/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-gradient-to-br from-purple-200/20 to-orange-200/20 blur-3xl animate-float-delayed" />
      
      {/* Sacred Geometry Elements */}
      <div className="absolute right-0 top-1/4 w-64 h-64 opacity-10">
        <img src="/backgrounds/sacred-geometry.svg" alt="" className="w-full h-full" />
      </div>
      <div className="absolute left-0 bottom-1/4 w-64 h-64 opacity-10 rotate-180">
        <img src="/backgrounds/sacred-geometry.svg" alt="" className="w-full h-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Om Symbol */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto">
              <img src="/backgrounds/om-symbol.svg" alt="Om" className="w-full h-full opacity-90" />
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              YourAstro
            </span>
            <span className="block mt-4 text-3xl md:text-4xl text-gray-800">
              Discover Your Cosmic Path
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with India's most trusted astrologers and unlock the ancient wisdom of Vedic astrology
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 text-white shadow-lg"
              asChild
            >
              <Link to="/astrologers" className="flex items-center">
                <PhoneCall className="mr-2 h-5 w-5" />
                Start Consultation
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="text-lg border-2 border-orange-500/30 text-gray-800 hover:bg-orange-50 px-8 py-6 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to="/horoscope" className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Daily Horoscope
              </Link>
            </Button>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative p-6 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">500+</h3>
                <p className="text-sm text-gray-600">Expert Astrologers</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative p-6 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="flex justify-center mb-2">
                  <Sun className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">24/7</h3>
                <p className="text-sm text-gray-600">Service Available</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative p-6 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="flex justify-center mb-2">
                  <Moon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">10K+</h3>
                <p className="text-sm text-gray-600">Daily Consultations</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative p-6 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="flex justify-center mb-2">
                  <Sparkles className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">4.8</h3>
                <p className="text-sm text-gray-600">Client Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
