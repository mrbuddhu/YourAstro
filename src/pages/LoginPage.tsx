
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Phone, Mail, AlertCircle } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be integrated with Supabase auth in the future
    toast({
      title: "Login Functionality",
      description: "This will be integrated with Supabase Auth in the future.",
      variant: "default",
    });
    
    console.log("Login with email:", email, "password:", password);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpSent(true);
    // This will be integrated with Supabase auth in the future
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${phone}`,
      variant: "default",
    });
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be integrated with Supabase auth in the future
    toast({
      title: "Login Functionality",
      description: "This will be integrated with Supabase Auth in the future.",
      variant: "default",
    });
    
    console.log("Login with phone:", phone, "OTP:", otp);
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="cosmic-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your 123Astro account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2">
                    <Phone size={16} />
                    Phone
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin}>
                    <div className="space-y-4">
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
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium">Password</label>
                          <Link to="/forgot-password" className="text-xs text-astro-purple hover:underline">
                            Forgot password?
                          </Link>
                        </div>
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
                      
                      <Button type="submit" className="w-full star-button">
                        Sign In
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone">
                  <form onSubmit={isOtpSent ? handlePhoneLogin : handleSendOtp}>
                    <div className="space-y-4">
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
                          disabled={isOtpSent}
                        />
                      </div>
                      
                      {isOtpSent && (
                        <div className="space-y-2">
                          <label htmlFor="otp" className="text-sm font-medium">
                            Verification Code
                          </label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="celestial-input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                          <p className="text-xs flex items-center gap-1 text-foreground/70">
                            <AlertCircle size={12} />
                            Didn't receive code? 
                            <button 
                              type="button" 
                              onClick={() => handleSendOtp} 
                              className="text-astro-purple hover:underline"
                            >
                              Resend
                            </button>
                          </p>
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full star-button">
                        {isOtpSent ? "Verify & Sign In" : "Send Verification Code"}
                      </Button>
                      
                      {isOtpSent && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full border-astro-purple/30 hover:bg-astro-purple/10"
                          onClick={() => setIsOtpSent(false)}
                        >
                          Change Phone Number
                        </Button>
                      )}
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-foreground/70">
                Don't have an account?{" "}
                <Link to="/signup" className="text-astro-purple hover:underline">
                  Sign up
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

export default LoginPage;
