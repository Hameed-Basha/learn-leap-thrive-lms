
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

// Define user type
interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up initial session and user
    const setInitialUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          await getUserProfile(data.session.user);
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };
    
    setInitialUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          await getUserProfile(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data from profiles table
  const getUserProfile = async (authUser: User) => {
    try {
      // Query the profiles table to get additional user data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Use temporary mock user data if profile not found
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.email?.split('@')[0] || 'User',
          role: 'student', // Default role
        });
        return;
      }

      // Set the user with data from the profiles table
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: data.name || authUser.email?.split('@')[0] || 'User',
        role: data.role || 'student',
        avatar: data.avatar_url,
      });
    } catch (error) {
      console.error('Error in getUserProfile:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        return { error };
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          },
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return { error };
      }

      // Create a profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              name,
              email,
              role: 'student', // Default role for new users
              created_at: new Date(),
            }
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
