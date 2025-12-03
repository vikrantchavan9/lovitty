
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { availableUsers, nishitaAiProfile } from '@/lib/data';

// This is a simplified user object for local auth
type LocalUser = {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female';
  user_metadata: {
      avatar_url: string;
      name: string;
  }
};

type AuthContextType = {
  user: LocalUser | null;
  session: LocalUser | null; // For local auth, session and user are the same
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>; // Will be a mock function
  signInWithEmail: (email: string, pass: string) => Promise<string | void>;
  signUpWithEmailAndPassword: (email: string, pass: string, name: string, gender: 'male' | 'female') => Promise<string | void>;
  userRole: 'user' | 'admin' | null;
  supabase: null; // Supabase is removed
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let welcomeToastShown = false;

// Mock user database for local development
const localUsers: Record<string, LocalUser> = {
    'nishita@lovekitty.ai': {
        id: 'user-nishita-ai',
        email: 'nishita@lovekitty.ai',
        name: 'Nishita AI',
        gender: 'female',
        user_metadata: {
            name: 'Nishita AI',
            avatar_url: nishitaAiProfile.image
        }
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for a saved user session
    setLoading(true);
    try {
        const savedUser = localStorage.getItem('lovekitty_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser) as LocalUser;
            setUser(parsedUser);
            if(!welcomeToastShown) {
                toast({ title: `Welcome back, ${parsedUser.name}!`});
                welcomeToastShown = true;
            }
        }
    } catch(e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('lovekitty_user');
    }
    setLoading(false);
  }, [toast]);
  

  const signInWithEmail = async (email: string, pass: string): Promise<string | void> => {
    setLoading(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    // For demonstration, we allow any password for a known user or create a new one
    const existingUser = Object.values(localUsers).find(u => u.email === email);
    
    if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('lovekitty_user', JSON.stringify(existingUser));
        toast({ title: `Welcome back, ${existingUser.name}!`});
        router.push('/home');
    } else {
        setLoading(false);
        return "User not found. Please sign up.";
    }
    setLoading(false);
  };

  const signUpWithEmailAndPassword = async (email: string, pass: string, name: string, gender: 'male' | 'female'): Promise<string | void> => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));

    if (localUsers[email]) {
        setLoading(false);
        return "An account with this email already exists.";
    }

    const newUser: LocalUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        gender,
        user_metadata: {
            name: name,
            avatar_url: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`
        }
    };

    localUsers[email] = newUser;
    setUser(newUser);
    localStorage.setItem('lovekitty_user', JSON.stringify(newUser));

    toast({ title: `Welcome, ${name}!`, description: "Your account has been created."});
    router.push('/home');
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('lovekitty_user');
    toast({ title: 'Logged Out', description: "You've been successfully signed out." });
    router.push('/login');
  };

  const signInWithGoogle = async () => {
    toast({
        variant: 'destructive',
        title: 'Feature Not Available',
        description: 'Google Sign-In is disabled in local auth mode.',
    });
  };

  const value: AuthContextType = {
    user,
    session: user, // In local auth, user and session are the same
    loading,
    logout,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmailAndPassword,
    userRole: user ? 'user' : null, // Simplified role
    supabase: null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
