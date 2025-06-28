import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AstrologerCard from "@/components/AstrologerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, Filter, Star, Clock, Globe, Award } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const AstrologersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("any");
  const [languageFilter, setLanguageFilter] = useState("any");
  const [sortOption, setSortOption] = useState("rating");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'astrologer');
      if (error) {
        setError('Failed to load astrologers.');
        setAstrologers([]);
      } else {
        setAstrologers(data || []);
      }
      setLoading(false);
    };
    fetchAstrologers();
  }, []);

  // Filter and sort astrologers based on criteria
  const filteredAstrologers = astrologers.filter(astrologer => {
    // Name search
    if (searchQuery && !astrologer.full_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Experience filter
    if (experienceFilter !== "any") {
      const minExperience = parseInt(experienceFilter.split("+")[0]);
      if ((astrologer.experience || 0) < minExperience) {
        return false;
      }
    }
    // Language filter
    if (languageFilter !== "any" && !(astrologer.languages || []).includes(languageFilter)) {
      return false;
    }
    // Online only filter
    if (showOnlineOnly && !astrologer.is_online) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOption === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortOption === "experience") {
      return (b.experience || 0) - (a.experience || 0);
    } else if (sortOption === "price_low") {
      return (a.price_per_min || 0) - (b.price_per_min || 0);
    } else if (sortOption === "price_high") {
      return (b.price_per_min || 0) - (a.price_per_min || 0);
    }
    return 0;
  });

  // Get all unique languages from astrologers
  const uniqueLanguages = Array.from(
    new Set(astrologers.flatMap(a => a.languages || []))
  ).sort();

  // Handler to show toast notifications on certain actions
  const handleFilterApply = () => {
    toast({
      title: "Filters Applied",
      description: `Found ${filteredAstrologers.length} astrologers matching your criteria.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Hero section */}
        <div className="cosmic-card p-8 mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="astro-gradient-text">Discover Your Cosmic Guide</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mb-6">
              Connect with experienced astrologers for personalized readings tailored to your unique cosmic journey.
            </p>
          </div>
          {/* Background decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-astro-purple/10 blur-3xl animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-astro-lightPurple/10 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        {/* Search and filters */}
        <div className="cosmic-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
              <Input
                className="pl-10 bg-muted/50 border-border/50 transition-all focus:ring-2 focus:ring-astro-purple/50"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border/50 transition-all hover:border-astro-purple/30">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-astro-purple/70" />
                    <SelectValue placeholder="Experience" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any Experience</SelectItem>
                    <SelectItem value="5+">5+ Years</SelectItem>
                    <SelectItem value="10+">10+ Years</SelectItem>
                    <SelectItem value="15+">15+ Years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border/50 transition-all hover:border-astro-purple/30">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-astro-purple/70" />
                    <SelectValue placeholder="Language" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="any">Any Language</SelectItem>
                    {uniqueLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[160px] bg-muted/50 border-border/50 transition-all hover:border-astro-purple/30">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-astro-purple/70" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant={showOnlineOnly ? "default" : "outline"}
                className={`cosmic-glow ${showOnlineOnly ? "bg-astro-purple hover:bg-astro-lightPurple" : "border-astro-purple/30 hover:bg-astro-purple/10"}`}
                onClick={() => {
                  setShowOnlineOnly(!showOnlineOnly);
                  setTimeout(() => handleFilterApply(), 300);
                }}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${showOnlineOnly ? "bg-green-400" : "bg-gray-400"}`}></span>
                Online Now
              </Button>
              <Button
                variant="outline"
                className="border-astro-purple/30 hover:bg-astro-purple/10"
                onClick={handleFilterApply}
              >
                <Filter size={16} className="mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="flex flex-wrap justify-between mb-8 gap-4">
          <div className="flex items-center gap-1 text-sm text-foreground/70">
            <Star size={16} className="text-astro-gold" />
            <span>Found <strong>{filteredAstrologers.length}</strong> astrologers</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="text-sm bg-muted/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Clock size={14} />
              <span>Available 24/7</span>
            </div>
            <div className="text-sm bg-muted/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={14} />
              <span>Verified Experts</span>
            </div>
          </div>
        </div>
        {/* Tabs for service types */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6 bg-muted/30 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-astro-purple">All</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-astro-purple">Chat Consultation</TabsTrigger>
            <TabsTrigger value="call" className="data-[state=active]:bg-astro-purple">Voice Call</TabsTrigger>
            <TabsTrigger value="remedies" className="data-[state=active]:bg-astro-purple">Remedies</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            {loading ? (
              <div className="text-center py-12">Loading astrologers...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAstrologers.map((astrologer) => (
                  <AstrologerCard key={astrologer.id} astrologer={astrologer} />
                ))}
              </div>
            )}
            {filteredAstrologers.length === 0 && !loading && !error && (
              <div className="cosmic-card p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search size={24} className="text-foreground/50" />
                </div>
                <p className="text-lg text-muted-foreground mb-4">No astrologers found matching your criteria.</p>
                <Button 
                  className="cosmic-glow bg-astro-purple hover:bg-astro-lightPurple"
                  onClick={() => {
                    setSearchQuery("");
                    setExperienceFilter("any");
                    setLanguageFilter("any");
                    setShowOnlineOnly(false);
                    toast({
                      title: "Filters Reset",
                      description: "Showing all available astrologers.",
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.filter(a => a.is_online).map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
            
            {filteredAstrologers.filter(a => a.is_online).length === 0 && (
              <div className="cosmic-card p-12 text-center">
                <p className="text-lg text-muted-foreground">No online astrologers available for chat at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="call" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.filter(a => a.is_online).map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
            
            {filteredAstrologers.filter(a => a.is_online).length === 0 && (
              <div className="cosmic-card p-12 text-center">
                <p className="text-lg text-muted-foreground">No online astrologers available for calls at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="remedies" className="mt-0">
            <div className="cosmic-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-astro-purple/20 flex items-center justify-center">
                <Star size={24} className="text-astro-purple" />
              </div>
              <h3 className="text-xl font-medium mb-2">Cosmic Remedies</h3>
              <p className="text-lg text-muted-foreground mb-4">Our remedy services will be available soon.</p>
              <p className="text-sm text-foreground/60 max-w-md mx-auto">
                Get personalized gemstone recommendations, mantras, and spiritual practices tailored to your cosmic profile.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AstrologersPage;
