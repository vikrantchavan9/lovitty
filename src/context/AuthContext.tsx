'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<string | void>;
  signUpWithEmailAndPassword: (email: string, pass: string, name: string, gender: 'male' | 'female') => Promise<string | void>;
  userRole: 'user' | 'admin' | null;
  supabase: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string): Promise<string | void> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setLoading(false);
      return error.message;
    }

    toast({ title: `Welcome back!` });
    router.push('/home');
    setLoading(false);
  };

  const signUpWithEmailAndPassword = async (email: string, pass: string, name: string, gender: 'male' | 'female'): Promise<string | void> => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
          gender,
          avatar_url: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`
        }
      }
    });

    if (error) {
      setLoading(false);
      return error.message;
    }

    toast({ title: `Account Created!`, description: "Please check your email to verify your account." });
    // Usually stay on login or go to a verification page, but for now pushing to home or login
    // router.push('/login'); 
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged Out', description: "You've been successfully signed out." });
    router.push('/login');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    logout,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmailAndPassword,
    userRole: user ? 'user' : null,
    supabase,
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
