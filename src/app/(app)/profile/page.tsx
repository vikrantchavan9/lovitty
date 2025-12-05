
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Simplified profile data for local auth
interface LocalProfile {
  name: string;
  username: string;
  email: string;
  mobile: string;
  photoURL: string;
  voice_intro_url: string;
  photos: string[];
  account_type: 'personal' | 'creator';
}


export default function ProfilePage() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      router.push('/login');
      return;
    }

    // Load profile from localStorage or create a new mock one
    const savedProfile = localStorage.getItem(`profile_${authUser.id}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Create a default profile if none exists
      const meta = authUser.user_metadata || {};
      const initialName = meta.name || authUser.email?.split('@')[0] || "User";

      setProfile({
        name: initialName,
        username: `${initialName.split(' ')[0].toLowerCase()}_${authUser.id.substring(0, 4)}`,
        email: authUser.email || "",
        mobile: "",
        photoURL: meta.avatar_url || "",
        voice_intro_url: "",
        photos: [],
        account_type: "personal",
      });
    }
    setLoading(false);
  }, [authUser, authLoading, router]);


  // -------- UPLOAD HANDLER (Mock) --------
  async function upload(file: File, bucket: string): Promise<string | null> {
    alert(`Mock Upload:\nFile: ${file.name}\nBucket: ${bucket}\nThis is a local simulation. Files are not actually uploaded.`);
    // Return a placeholder URL
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    if (file.type.startsWith('audio/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  // -------- UPDATE PROFILE (Local) --------
  async function saveProfile() {
    if (!authUser || !profile) return;
    localStorage.setItem(`profile_${authUser.id}`, JSON.stringify(profile));
    alert("Profile Updated! (Locally)");
  }


  // -------- DELETE ACCOUNT (Local) --------
  async function deleteAccount() {
    if (!authUser) return;
    if (confirm("This is permanent and cannot be undone. Are you sure you want to delete your account?")) {
      localStorage.removeItem(`profile_${authUser.id}`);
      await logout(); // This will clear the main user session
      alert("Account deleted.");
    }
  }

  if (loading || authLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (!authUser || !profile) return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-muted-foreground mb-4">Could not load profile. Please try logging in again.</p>
      <Button onClick={() => router.push('/login')}>Go to Login</Button>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* DP Upload */}
      <div>
        <p className="mb-1 font-semibold">Profile Picture</p>
        <Input
          type="file"
          className="file:text-primary file:font-semibold"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !profile) return;
            const url = await upload(file, "avatars");
            if (url) setProfile({ ...profile, photoURL: url });
          }}
        />
        {profile.photoURL && <img src={profile.photoURL} alt="Profile" className="w-32 h-32 rounded-full mt-2 object-cover" />}
      </div>

      {/* Name */}
      <Input
        placeholder="Name"
        value={profile.name || ""}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />

      {/* Username */}
      <Input
        placeholder="Username"
        value={profile.username || ""}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />

      {/* Email (read only) */}
      <Input value={profile.email} readOnly disabled />

      {/* Mobile */}
      <Input
        placeholder="Mobile Number"
        value={profile.mobile || ""}
        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
      />

      {/* Voice Intro */}
      <div>
        <p className="mb-1 font-semibold">Voice Intro</p>
        <Input
          type="file"
          accept="audio/*"
          className="file:text-primary file:font-semibold"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !profile) return;
            const url = await upload(file, "voice_intros");
            if (url) setProfile({ ...profile, voice_intro_url: url });
          }}
        />
        {profile.voice_intro_url && <audio controls src={profile.voice_intro_url} className="mt-2 w-full" />}
      </div>

      {/* Photos Upload */}
      <div>
        <p className="font-semibold">Upload up to 5 photos</p>
        <Input
          type="file"
          accept="image/png, image/jpeg"
          className="file:text-primary file:font-semibold"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !profile) return;
            if (profile.photos.length >= 5) return alert("Max 5 photos allowed");
            const url = await upload(file, "gallery_photos");
            if (url) setProfile({ ...profile, photos: [...profile.photos, url] });
          }}
        />
        <div className="grid grid-cols-3 gap-2 mt-3">
          {profile.photos.map((p, i) => (
            <div key={i} className="relative group">
              <img src={p} alt={`Gallery photo ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => profile && setProfile({ ...profile, photos: profile.photos.filter(photo => photo !== p) })}
              >
                X
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Switch Account Type */}
      <div className="mt-4">
        <p className="font-semibold">Account Type</p>

        <select
          value={profile.account_type || 'personal'}
          onChange={(e) =>
            setProfile({ ...profile, account_type: e.target.value as 'personal' | 'creator' })
          }
          className="border p-2 rounded w-full bg-background"
        >
          <option value="personal">Personal</option>
          <option value="creator">Creator</option>
        </select>
      </div>

      <Button onClick={saveProfile} className="w-full">
        Save Profile
      </Button>

      <Button onClick={logout} variant="outline" className="w-full">
        Logout
      </Button>

      <Button
        onClick={deleteAccount}
        variant="destructive"
        className="w-full"
      >
        Delete Account
      </Button>
    </div>
  );
}
