import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, PhoneCall } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export interface AstrologerProps {
  id: string;
  name: string;
  image: string;
  gender: 'male' | 'female';
  rating: number;
  reviewCount: number;
  experience: number;
  languages: string[];
  specialties: string[];
  pricePerMin: number;
  isOnline: boolean;
}

const getDefaultImage = (gender: 'male' | 'female') => {
  return gender === 'male' 
    ? '/placeholder.svg'
    : '/placeholder.svg';
};

const AstrologerCard = ({ astrologer }: { astrologer: AstrologerProps }) => {
  const { requireAuth } = useAuth();
  const navigate = useNavigate();

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth('start a chat consultation')) {
      navigate(`/chat/${astrologer.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (requireAuth('start a voice call')) {
      navigate(`/call/${astrologer.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar with online indicator */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-purple-100 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src={astrologer.image || getDefaultImage(astrologer.gender)} 
                alt={`${astrologer.name} - Indian Astrologer`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getDefaultImage(astrologer.gender);
                }}
              />
            </div>
          </div>
          {astrologer.isOnline && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                {astrologer.name}
              </h3>
              <p className="text-sm text-gray-600">{astrologer.experience} years experience</p>
              <p className="text-sm text-gray-600">{astrologer.languages.join(', ')}</p>
            </div>
          </div>

          <div className="mt-2">
            {astrologer.specialties.slice(0, 3).map((specialty, index) => (
              <span 
                key={index} 
                className="inline-block text-sm bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full mr-2 mb-1"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-semibold text-orange-500">₹{astrologer.pricePerMin}/min</p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleChatClick}
            className="border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
          >
            <MessageCircle size={16} className="mr-1 text-orange-600" />
            Chat
          </Button>
          
          <Button 
            size="sm"
            onClick={handleCallClick}
            className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white transition-all duration-300"
          >
            <PhoneCall size={16} className="mr-1" />
            Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AstrologerCard;
