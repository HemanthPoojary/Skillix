"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: {
      user: User | null;
      session: Session | null;
    } | null;
  }>;
  signUp: (email: string, password: string, userData: any) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: {} | null;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { error: authError, data: null };
    }

    if (!authData?.user) {
      return { error: new Error('User creation failed'), data: null };
    }

    // 2. Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        username: userData.username,
        name: userData.name,
        avatar_url: userData.avatar_url || null,
        bio: userData.bio || null,
      });

    if (profileError) {
      return { error: profileError, data: null };
    }

    // 3. Create initial user stats
    const { error: statsError } = await supabase
      .from('user_stats')
      .insert({
        user_id: authData.user.id
      });

    if (statsError) {
      return { error: statsError, data: null };
    }

    // 4. Add user interests if provided
    if (userData.interests && userData.interests.length > 0) {
      const interestData = userData.interests.map((interestId: string) => ({
        user_id: authData.user.id,
        interest_id: interestId
      }));

      const { error: interestsError } = await supabase
        .from('user_interests')
        .insert(interestData);

      if (interestsError) {
        return { error: interestsError, data: null };
      }
    }

    return { error: null, data: authData };
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Reset password
  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 