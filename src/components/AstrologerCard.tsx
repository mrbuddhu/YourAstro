
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, PhoneCall, Languages } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

export interface AstrologerProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  experience: number;
  languages: string[];
  specialties: string[];
  pricePerMin: number;
  isOnline: boolean;
}

const AstrologerCard = ({ astrologer }: { astrologer: AstrologerProps }) => {
  return (
    <div className="cosmic-card overflow-hidden">
      {/* Online status badge */}
      {astrologer.isOnline && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-green-500 hover:bg-green-600">Online Now</Badge>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-astro-purple/30">
            <AvatarImage src={astrologer.image} alt={astrologer.name} />
            <AvatarFallback className="bg-astro-purple/20">
              {astrologer.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">{astrologer.name}</h3>
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-astro-gold text-astro-gold" />
                <span className="font-medium">{astrologer.rating}</span>
                <span className="text-sm text-foreground/70">({astrologer.reviewCount})</span>
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-sm px-2 py-0.5 bg-astro-purple/10 rounded-full">
                {astrologer.experience} yrs
              </span>
              <span className="flex items-center gap-1 text-sm px-2 py-0.5 bg-astro-purple/10 rounded-full">
                <Languages size={12} />
                {astrologer.languages.join(', ')}
              </span>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {astrologer.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-muted text-foreground/70">
                  {specialty}
                </Badge>
              ))}
              {astrologer.specialties.length > 3 && (
                <Badge variant="secondary" className="bg-muted text-foreground/70">
                  +{astrologer.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-foreground/70">Price</p>
            <p className="font-bold text-astro-gold">₹{astrologer.pricePerMin}/min</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-astro-purple/30 hover:bg-astro-purple/10"
              asChild
            >
              <Link to={`/chat/${astrologer.id}`}>
                <MessageCircle size={16} className="mr-1" />
                Chat
              </Link>
            </Button>
            
            <Button 
              size="sm"
              className="bg-astro-purple hover:bg-astro-lightPurple"
              asChild
            >
              <Link to={`/call/${astrologer.id}`}>
                <PhoneCall size={16} className="mr-1" />
                Call
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologerCard;
