import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, AlertCircle, User, Star, Loader2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "astrologer">("user");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Additional fields for astrologers
  const [experience, setExperience] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [pricePerMin, setPricePerMin] = useState("");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Please accept terms",
        description: "You must accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Validate required fields for astrologers
      if (role === "astrologer") {
        if (!experience || !specialties.length || !languages.length || !bio || !pricePerMin) {
          throw new Error("Please fill in all required fields for astrologer registration");
        }
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
            phone: phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        toast({
          title: "Signup Successful",
          description: "Account created! Please check your email for a confirmation link before logging in.",
          variant: "default",
        });
        // Redirect to login page after short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const specialtyOptions = [
    "Vedic Astrology",
    "Numerology",
    "Tarot Reading",
    "Palmistry",
    "Vastu",
    "Horoscope Analysis",
    "Relationship Counseling",
    "Career Guidance",
    "Marriage Compatibility",
    "Gem Recommendations"
  ];

  const languageOptions = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Punjabi"
  ];

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="cosmic-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>Join YourAstro for personalized cosmic guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignup}>
                <div className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">I want to join as</label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={role === "user" ? "default" : "outline"}
                        className={role === "user" ? "star-button" : "border-astro-purple/30"}
                        onClick={() => setRole("user")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        User
                      </Button>
                      <Button
                        type="button"
                        variant={role === "astrologer" ? "default" : "outline"}
                        className={role === "astrologer" ? "star-button" : "border-astro-purple/30"}
                        onClick={() => setRole("astrologer")}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Astrologer
                      </Button>
                    </div>
                  </div>

                  {/* Common Fields */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="celestial-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="celestial-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      className="celestial-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="celestial-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Astrologer-specific Fields */}
                  {role === "astrologer" && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="experience" className="text-sm font-medium">Years of Experience</label>
                        <Input
                          id="experience"
                          type="number"
                          placeholder="5"
                          className="celestial-input"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Specialties</label>
                        <Select
                          value={specialties.join(",")}
                          onValueChange={(value) => setSpecialties(value.split(","))}
                        >
                          <SelectTrigger className="celestial-input">
                            <SelectValue placeholder="Select your specialties" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialtyOptions.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Languages</label>
                        <Select
                          value={languages.join(",")}
                          onValueChange={(value) => setLanguages(value.split(","))}
                        >
                          <SelectTrigger className="celestial-input">
                            <SelectValue placeholder="Select languages you speak" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about your experience and expertise..."
                          className="celestial-input min-h-[100px]"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pricePerMin" className="text-sm font-medium">Price per Minute (₹)</label>
                        <Input
                          id="pricePerMin"
                          type="number"
                          placeholder="20"
                          className="celestial-input"
                          value={pricePerMin}
                          onChange={(e) => setPricePerMin(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      I accept the terms and conditions
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full star-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-foreground/70">
                Already have an account?{" "}
                <Link to="/login" className="text-astro-purple hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignupPage;
