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
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  wallet_balance: number;
  user_type: 'user' | 'astrologer';
  experience?: number;
  specialties?: string[];
  languages?: string[];
  bio?: string;
  price_per_min?: number;
  is_verified?: boolean;
  rating?: number;
  total_consultations?: number;
}

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Fetch from unified profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setEditForm(profileData);
        } else {
          // Create profile if it doesn't exist
          const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            phone: '',
            wallet_balance: 0,
            user_type: 'user'
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createdProfile) {
            setProfile(createdProfile);
            setEditForm(createdProfile);
          }

          if (createError) {
            console.error('Error creating profile:', createError);
            toast({
              title: "Error",
              description: "Failed to create profile",
              variant: "destructive",
            });
          }
        }

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
          throw profileError;
        }
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
    if (!user || !profile) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
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
                  {profile?.user_type === 'astrologer' ? "Manage your astrologer profile" : "Manage your account settings"}
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
                  {profile.user_type === 'astrologer' && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Verification Status</div>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        profile.is_verified
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {profile.is_verified ? 'Verified' : 'Pending Verification'}
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

                  {profile.user_type === 'astrologer' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Experience (years)</label>
                        <Input
                          type="number"
                          value={isEditing ? editForm.experience : profile.experience}
                          onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price per Minute (₹)</label>
                        <Input
                          type="number"
                          value={isEditing ? editForm.price_per_min : profile.price_per_min}
                          onChange={(e) => setEditForm({ ...editForm, price_per_min: parseInt(e.target.value) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Specialties (comma-separated)</label>
                        <Input
                          value={isEditing ? editForm.specialties.join(', ') : profile.specialties?.join(', ')}
                          onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value.split(',').map((s: string) => s.trim()) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Languages (comma-separated)</label>
                        <Input
                          value={isEditing ? editForm.languages.join(', ') : profile.languages?.join(', ')}
                          onChange={(e) => setEditForm({ ...editForm, languages: e.target.value.split(',').map((s: string) => s.trim()) })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea
                          value={isEditing ? editForm.bio : profile.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Rating</div>
                          <div className="font-medium">{profile.rating?.toFixed(1) || 'N/A'} / 5.0</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Total Consultations</div>
                          <div className="font-medium">{profile.total_consultations || 'N/A'}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Wallet Balance</label>
                      <div className="text-2xl font-bold text-astro-gold">₹{profile.wallet_balance}</div>
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