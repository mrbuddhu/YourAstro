import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-astro-purple/20 rounded-full"></div>
                <div className="absolute inset-1 bg-gradient-to-r from-astro-purple to-astro-lightPurple rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">YA</span>
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">YourAstro</span>
            </Link>
            
            <p className="mt-4 text-sm text-foreground/70">
              Connecting you with the cosmic guidance you need through expert astrologers.
            </p>
            
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-foreground/60 hover:text-astro-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-astro-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-astro-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-astro-purple transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/astrologers" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Astrologers
                </Link>
              </li>
              <li>
                <Link to="/horoscope" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Daily Horoscope
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Astrology Blog
                </Link>
              </li>
              <li>
                <Link to="/compatibility" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Compatibility Check
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-foreground/70 hover:text-astro-purple transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-foreground/70">
                <Phone size={16} />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-2 text-foreground/70">
                <Mail size={16} />
                <span>support@yourastro.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/10 mt-10 pt-6 text-center">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} YourAstro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
