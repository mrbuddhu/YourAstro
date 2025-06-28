import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AstrologerProfilePage = () => {
  const { astrologerId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch astrologer profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!astrologerId) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', astrologerId)
        .single();
      if (data) {
        setProfile(data);
        setEditForm(data);
      }
    };
    fetchProfile();
  }, [astrologerId]);

  const isOwnProfile = isAuthenticated && user?.id === astrologerId && profile?.user_type === 'astrologer';

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', astrologerId);
      if (error) throw error;
      setProfile(editForm);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Astrologer Not Found</h1>
          <Button asChild>
            <Link to="/astrologers">Back to Astrologers</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-12">
        <Card className="max-w-xl mx-auto p-8">
          <div className="flex flex-col items-center">
            <img src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} className="w-32 h-32 rounded-full mb-4" />
            {isEditing ? (
              <>
                <Input
                  className="mb-2 text-center text-2xl font-bold"
                  value={editForm.full_name}
                  onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                />
                <Textarea
                  className="mb-2 text-center"
                  value={editForm.bio || ''}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Bio"
                />
                <Input
                  className="mb-2"
                  value={editForm.specialties?.join(', ') || ''}
                  onChange={e => setEditForm({ ...editForm, specialties: e.target.value.split(',').map((s: string) => s.trim()) })}
                  placeholder="Specialties (comma separated)"
                />
                <Input
                  className="mb-2"
                  value={editForm.languages?.join(', ') || ''}
                  onChange={e => setEditForm({ ...editForm, languages: e.target.value.split(',').map((s: string) => s.trim()) })}
                  placeholder="Languages (comma separated)"
                />
                <Input
                  className="mb-2"
                  type="number"
                  value={editForm.experience || ''}
                  onChange={e => setEditForm({ ...editForm, experience: parseInt(e.target.value) })}
                  placeholder="Experience (years)"
                />
                <Input
                  className="mb-2"
                  type="number"
                  value={editForm.price_per_min || ''}
                  onChange={e => setEditForm({ ...editForm, price_per_min: parseInt(e.target.value) })}
                  placeholder="Price per min"
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{profile.full_name}</h2>
                <div className="text-gray-600 mb-2">{profile.specialties?.join(", ")}</div>
                <div className="mb-2">{profile.bio}</div>
                <div className="mb-2">Experience: {profile.experience} years</div>
                <div className="mb-2">Languages: {profile.languages?.join(", ")}</div>
                <div className="mb-2">Rating: {profile.rating} ⭐ ({profile.total_consultations} reviews)</div>
                <div className="mb-2">Price: ₹{profile.price_per_min}/min</div>
                {isOwnProfile && (
                  <Button className="mt-2" onClick={handleEdit}>Edit Profile</Button>
                )}
              </>
            )}
            <div className="flex gap-4 mt-4">
              <Button asChild>
                <Link to={`/chat/${profile.id}`}>Chat</Link>
              </Button>
              <Button asChild>
                <Link to={`/call/${profile.id}`}>Call</Link>
              </Button>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default AstrologerProfilePage; 