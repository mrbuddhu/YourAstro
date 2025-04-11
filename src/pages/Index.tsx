
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AstrologerCard from "@/components/AstrologerCard";
import { mockAstrologers } from "@/data/mockAstrologers";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { ChevronRight, Star, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

const Index = () => {
  // Only display online astrologers and limit to 4
  const featuredAstrologers = mockAstrologers
    .filter(a => a.isOnline)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  return (
    <>
      <Navbar />
      
      <main>
        <HeroSection />
        
        {/* Featured Astrologers */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-pink-500/5" />
          <div className="absolute inset-0 opacity-10 bg-[url('/backgrounds/mandala-pattern.svg')] bg-repeat bg-center" />
          <div className="container mx-auto relative">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Expert Astrologers</h2>
                <p className="text-foreground/70 text-lg">Connect with our experienced astrologers for guidance</p>
              </div>
              <Button variant="outline" asChild className="border-orange-500/30 hover:bg-orange-500/10 transform hover:scale-105 transition-all duration-300">
                <Link to="/astrologers" className="flex items-center text-lg">
                  View All Astrologers
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAstrologers.map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-orange-500/5" />
          <div className="absolute inset-0 opacity-10 bg-[url('/backgrounds/mandala-pattern.svg')] bg-repeat bg-center transform rotate-180" />
          <div className="container mx-auto relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="w-20 h-20 mx-auto mb-6 opacity-20 bg-[url('/backgrounds/om-symbol.svg')] bg-contain bg-no-repeat bg-center" />
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Spiritual Services</h2>
              <p className="text-foreground/70 text-lg">
                Discover insights about your past, present, and future through our specialized astrology services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cosmic-card border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 flex items-center justify-center">
                    <MessageCircle size={32} className="text-orange-500" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Chat Consultation</CardTitle>
                  <CardDescription>Connect instantly through chat</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Instant connectivity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Private & confidential</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Detailed text guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Chat history saved</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 star-button" asChild>
                    <Link to="/astrologers">Start Chat</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cosmic-card relative overflow-hidden border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm px-4 py-1">
                  Most Popular
                </div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 flex items-center justify-center">
                    <ShieldCheck size={32} className="text-orange-500" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Voice Call</CardTitle>
                  <CardDescription>Personal voice consultation</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Direct conversation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Deeper personal connection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Instant clarifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Call recordings available</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 star-button" asChild>
                    <Link to="/astrologers">Book Call</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cosmic-card border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-pink-500/5 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 flex items-center justify-center">
                    <Sparkles size={32} className="text-orange-500" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Solutions</CardTitle>
                  <CardDescription>Personalized astrological remedies</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Custom remedial measures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Planetary appeasement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Gemstone recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star size={16} className="text-astro-gold" />
                      <span>Ritual guidance</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-muted hover:bg-muted/80" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-foreground/70">
                Real stories from people who found guidance through our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  testimony: "The guidance I received was life-changing. My astrologer provided insights that helped me make crucial career decisions.",
                  rating: 5
                },
                {
                  name: "Rahul Mehta",
                  testimony: "I was skeptical at first, but the accuracy of the predictions was astonishing. I've been consulting regularly for the past 6 months.",
                  rating: 5
                },
                {
                  name: "Anjali Patel",
                  testimony: "The relationship advice from my astrologer helped me understand my partner better. Our communication has improved significantly.",
                  rating: 4
                }
              ].map((testimonial, index) => (
                <Card key={index} className="cosmic-card">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          size={18}
                          className={i < testimonial.rating ? "fill-astro-gold text-astro-gold" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                    <p className="mb-4 italic">"{testimonial.testimony}"</p>
                    <p className="font-medium">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-astro-darkBlue to-astro-purple">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Begin Your Cosmic Journey Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get answers to life's most important questions with guidance from our experienced astrologers.
            </p>
            <Button size="lg" className="star-button text-lg px-8 py-6" asChild>
              <Link to="/signup">Create Your Free Account</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
