import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  prediction: string;
}

const zodiacSigns: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    dateRange: "March 21 - April 19",
    prediction: "Today brings exciting opportunities for personal growth. Trust your instincts."
  },
  {
    name: "Taurus",
    symbol: "♉",
    dateRange: "April 20 - May 20",
    prediction: "Focus on stability and material comfort. A financial opportunity may arise."
  },
  {
    name: "Gemini",
    symbol: "♊",
    dateRange: "May 21 - June 20",
    prediction: "Communication is highlighted today. Express your ideas with confidence."
  },
  {
    name: "Cancer",
    symbol: "♋",
    dateRange: "June 21 - July 22",
    prediction: "Emotional connections deepen today. Trust your intuition in relationships."
  },
  {
    name: "Leo",
    symbol: "♌",
    dateRange: "July 23 - August 22",
    prediction: "Your creative energy is at its peak. Take the lead in important projects."
  },
  {
    name: "Virgo",
    symbol: "♍",
    dateRange: "August 23 - September 22",
    prediction: "Focus on details and organization. Your analytical skills are enhanced."
  },
  {
    name: "Libra",
    symbol: "♎",
    dateRange: "September 23 - October 22",
    prediction: "Balance and harmony are key today. Important decisions await."
  },
  {
    name: "Scorpio",
    symbol: "♏",
    dateRange: "October 23 - November 21",
    prediction: "Transformation is highlighted. Trust in your inner strength."
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    dateRange: "November 22 - December 21",
    prediction: "Adventure calls today. Expand your horizons and learn something new."
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dateRange: "December 22 - January 19",
    prediction: "Career opportunities arise. Stay focused on your long-term goals."
  },
  {
    name: "Aquarius",
    symbol: "♒",
    dateRange: "January 20 - February 18",
    prediction: "Innovation and originality are highlighted. Trust your unique perspective."
  },
  {
    name: "Pisces",
    symbol: "♓",
    dateRange: "February 19 - March 20",
    prediction: "Your intuition is strong today. Creative inspiration flows freely."
  }
];

const HoroscopePage = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Daily Horoscope</h1>
        <p className="text-slate-300 text-center mb-8">{currentDate}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {zodiacSigns.map((sign, index) => (
            <motion.div
              key={sign.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-slate-700 hover:border-slate-500 transition-colors">
                <div className="text-4xl text-center mb-2">{sign.symbol}</div>
                <h2 className="text-xl font-semibold text-white text-center mb-1">{sign.name}</h2>
                <p className="text-sm text-slate-400 text-center mb-4">{sign.dateRange}</p>
                <p className="text-slate-300 text-center">{sign.prediction}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoroscopePage;