import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  getUserProfile, 
  signInWithEmail, 
  signOut, 
  signUp as authSignUp, 
  getSession, 
  UserProfile,
  createProfile
} from '@/services/authService';

// Define user type
interface AuthUser extends UserProfile {
  // Extend from UserProfile if needed
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: 'student' | 'instructor' | 'admin') => Promise<{ error: any }>;
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
        const { data, error } = await getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user);
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
          await fetchUserProfile(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data from profiles table using our service
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await getUserProfile(authUser.id);

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If the profile doesn't exist but we have user metadata, create the profile
        const metadata = authUser.user_metadata;
        if (metadata && (metadata.name || metadata.needsProfileCreation)) {
          console.log('Profile not found but user metadata exists, creating profile...');
          
          const { data: newProfile, error: createError } = await createProfile({
            id: authUser.id,
            email: authUser.email || '',
            name: metadata.name || authUser.email?.split('@')[0] || 'User',
            role: metadata.role || 'student',
          });
          
          if (createError) {
            console.error('Failed to create profile during login:', createError);
          } else if (newProfile) {
            setUser(newProfile);
            return;
          }
        }
        
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
      setUser(profile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        setLoading(false);
        return { error };
      }
      
      // If we have a user, fetch their profile
      if (data?.user) {
        try {
          await fetchUserProfile(data.user);
          setSession(data.session);
        } catch (profileError) {
          console.error('Error during profile fetch:', profileError);
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Error in login function:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
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
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
        return;
      }
      
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
  const signUp = async (email: string, password: string, name: string, role: 'student' | 'instructor' | 'admin' = 'student') => {
    try {
      setLoading(true);
      console.log('Starting signup process for:', email);
      
      const { data, error } = await authSignUp(email, password, name, role);

      if (error) {
        console.error('Signup error:', error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return { error };
      }

      console.log('Signup successful:', data);
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
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
