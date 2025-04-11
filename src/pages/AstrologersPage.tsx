
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AstrologerCard from "@/components/AstrologerCard";
import { mockAstrologers } from "@/data/mockAstrologers";
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
import { Search, Filter } from 'lucide-react';

const AstrologersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [sortOption, setSortOption] = useState("rating");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  // Filter and sort astrologers based on criteria
  const filteredAstrologers = mockAstrologers.filter(astrologer => {
    // Name search
    if (searchQuery && !astrologer.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Experience filter
    if (experienceFilter) {
      const minExperience = parseInt(experienceFilter.split("+")[0]);
      if (astrologer.experience < minExperience) {
        return false;
      }
    }
    
    // Language filter
    if (languageFilter && !astrologer.languages.includes(languageFilter)) {
      return false;
    }
    
    // Online only filter
    if (showOnlineOnly && !astrologer.isOnline) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (sortOption === "rating") {
      return b.rating - a.rating;
    } else if (sortOption === "experience") {
      return b.experience - a.experience;
    } else if (sortOption === "price_low") {
      return a.pricePerMin - b.pricePerMin;
    } else if (sortOption === "price_high") {
      return b.pricePerMin - a.pricePerMin;
    }
    return 0;
  });
  
  // Get all unique languages from astrologers
  const uniqueLanguages = Array.from(
    new Set(mockAstrologers.flatMap(a => a.languages))
  ).sort();
  
  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Astrologer</h1>
        
        {/* Search and filters */}
        <div className="cosmic-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
              <Input
                className="pl-10 bg-muted/50 border-border/50"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">Any Experience</SelectItem>
                    <SelectItem value="5+">5+ Years</SelectItem>
                    <SelectItem value="10+">10+ Years</SelectItem>
                    <SelectItem value="15+">15+ Years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">Any Language</SelectItem>
                    {uniqueLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
                  <SelectValue placeholder="Sort by" />
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
                className={showOnlineOnly ? "bg-astro-purple hover:bg-astro-lightPurple" : "border-astro-purple/30 hover:bg-astro-purple/10"}
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              >
                Online Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs for service types */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="chat">Chat Consultation</TabsTrigger>
            <TabsTrigger value="call">Voice Call</TabsTrigger>
            <TabsTrigger value="remedies">Remedies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
            
            {filteredAstrologers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No astrologers found matching your criteria.</p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setExperienceFilter("");
                    setLanguageFilter("");
                    setShowOnlineOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.filter(a => a.isOnline).map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="call" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.filter(a => a.isOnline).map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="remedies" className="mt-0">
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Remedy services coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </>
  );
};

export default AstrologersPage;
