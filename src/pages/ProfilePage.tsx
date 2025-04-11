import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  wallet_balance: number;
}

interface AstrologerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  experience: number;
  specialties: string[];
  languages: string[];
  bio: string;
  price_per_min: number;
  is_verified: boolean;
  rating: number;
  total_consultations: number;
}

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | AstrologerProfile | null>(null);
  const [isAstrologer, setIsAstrologer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // First check if user is an astrologer
        const { data: astrologerData, error: astrologerError } = await supabase
          .from('astrologer_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (astrologerData) {
          setProfile(astrologerData);
          setIsAstrologer(true);
          setEditForm(astrologerData);
          return;
        }

        // If not an astrologer, fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userData) {
          setProfile(userData);
          setEditForm(userData);
        }

        if (userError) throw userError;
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const table = isAstrologer ? 'astrologer_profiles' : 'user_profiles';
      const { error } = await supabase
        .from(table)
        .update(editForm)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(editForm);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-astro-purple" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-16 px-4">
        <Card className="max-w-2xl mx-auto cosmic-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Profile Settings</CardTitle>
                <CardDescription>
                  {isAstrologer ? "Manage your astrologer profile" : "Manage your account settings"}
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{profile.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  {isAstrologer && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Verification Status</div>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        (profile as AstrologerProfile).is_verified
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {(profile as AstrologerProfile).is_verified ? 'Verified' : 'Pending Verification'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={isEditing ? editForm.full_name : profile.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input value={profile.email} disabled />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={isEditing ? editForm.phone : profile.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  {isAstrologer ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Experience (years)</label>
                        <Input
                          type="number"
                          value={isEditing ? editForm.experience : (profile as AstrologerProfile).experience}
                          onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price per Minute (₹)</label>
                        <Input
                          type="number"
                          value={isEditing ? editForm.price_per_min : (profile as AstrologerProfile).price_per_min}
                          onChange={(e) => setEditForm({ ...editForm, price_per_min: parseInt(e.target.value) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Specialties (comma-separated)</label>
                        <Input
                          value={isEditing ? editForm.specialties.join(', ') : (profile as AstrologerProfile).specialties.join(', ')}
                          onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value.split(',').map((s: string) => s.trim()) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Languages (comma-separated)</label>
                        <Input
                          value={isEditing ? editForm.languages.join(', ') : (profile as AstrologerProfile).languages.join(', ')}
                          onChange={(e) => setEditForm({ ...editForm, languages: e.target.value.split(',').map((s: string) => s.trim()) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea
                          value={isEditing ? editForm.bio : (profile as AstrologerProfile).bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Rating</div>
                          <div className="font-medium">{(profile as AstrologerProfile).rating.toFixed(1)} / 5.0</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Total Consultations</div>
                          <div className="font-medium">{(profile as AstrologerProfile).total_consultations}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Wallet Balance</label>
                      <div className="text-2xl font-bold text-astro-gold">₹{(profile as UserProfile).wallet_balance}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-astro-purple" />
                <p className="mt-2 text-muted-foreground">Loading profile...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage; 