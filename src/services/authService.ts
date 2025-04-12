import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { USE_MOCK_AUTH, mockSignIn, mockGetProfile } from '@/lib/mockAuth';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url?: string;
  bio?: string;
}

/**
 * Helper function to add timeout to any promise
 * @param promise The promise to add timeout to
 * @param timeoutMs Timeout in milliseconds
 * @param errorMessage Error message to throw on timeout
 */
const withTimeout = (promise, timeoutMs = 5000, errorMessage = 'Operation timed out') => {
  let timeoutId;
  
  // Create a promise that rejects after timeout
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });
  
  // Race the original promise with the timeout
  return Promise.race([
    promise,
    timeoutPromise
  ]).finally(() => clearTimeout(timeoutId));
};

/**
 * Sign in with email and password
 * @param email User's email
 * @param password User's password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('Authenticating with Supabase:', email);
    
    // Check if mock auth is enabled
    if (USE_MOCK_AUTH) {
      console.log('Using mock authentication');
      return await mockSignIn(email, password);
    }
    
    // Use timeout mechanism to prevent hanging - reduced from 15000 to 5000
    const authPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    try {
      const { data, error } = await withTimeout(
        authPromise, 
        5000, 
        'Authentication request timed out. Please try again.'
      );
      
      if (error) {
        console.error('Supabase auth error during sign in:', error);
        
        // If timeout or network error, try mock auth as fallback
        if (error.message.includes('timeout') || error.message.includes('network')) {
          console.log('Supabase timeout detected, falling back to mock auth');
          return await mockSignIn(email, password);
        }
        
        return { data: null, error };
      }
      
      console.log('Supabase auth successful, user id:', data?.user?.id);
      return { data, error: null };
    } catch (timeoutError) {
      console.error('Authentication timed out, using mock auth as fallback:', timeoutError);
      return await mockSignIn(email, password);
    }
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return { data: null, error: err };
  }
};

/**
 * Sign up with email and password
 * @param email User's email
 * @param password User's password
 * @param name User's full name
 * @param role User role (defaults to 'student')
 */
export const signUp = async (email: string, password: string, name: string, role: 'student' | 'instructor' | 'admin' = 'student') => {
  try {
    console.log('Creating auth user with Supabase:', email, role);
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          role // Store role in user metadata too
        }
      }
    });
    
    if (error) {
      console.error('Supabase auth error during sign up:', error);
      return { data, error };
    }
    
    console.log('Auth user created successfully, user:', data.user?.id);
    
    // 2. If successful, create a profile
    if (data.user && !error) {
      console.log('Creating profile for user:', data.user.id);
      const { data: profileData, error: profileError } = await createProfile({
        id: data.user.id,
        email,
        name,
        role, // Use the provided role
      });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return { data, error: profileError };
      }
      
      console.log('Profile created successfully:', profileData);
    }
    
    return { data, error };
  } catch (err) {
    console.error('Unexpected error during sign up:', err);
    return { data: null, error: err };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  return await supabase.auth.signOut();
};

/**
 * Get the current user session
 */
export const getSession = async (): Promise<{ data: { session: Session | null }, error: any }> => {
  return await supabase.auth.getSession();
};

/**
 * Create a user profile in the profiles table
 * @param profile User profile data
 */
export const createProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
  try {
    console.log('Creating profile with data:', profile);
    // Try to use our custom database function that bypasses RLS
    const { data, error } = await supabase
      .rpc('create_new_profile', {
        user_id: profile.id,
        user_email: profile.email,
        user_name: profile.name,
        user_role: profile.role
      });
    
    if (error) {
      console.error('Error calling create_new_profile function:', error);
      
      // Fall back to direct insert which may fail due to RLS
      console.log('Falling back to direct insert method');
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error with fallback profile insertion:', insertError);
      } else {
        console.log('Profile created successfully via direct insert:', insertData);
      }
      
      return { data: insertData, error: insertError };
    }
    
    console.log('Profile created successfully via RPC:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createProfile:', error);
    return { data: null, error };
  }
};

/**
 * Get a user profile by ID
 * @param userId User ID
 */
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null, error: any }> => {
  try {
    console.log('Fetching user profile for ID:', userId);
    
    // Try mock profile first if enabled or as fallback
    if (USE_MOCK_AUTH) {
      console.log('Using mock profile');
      return await mockGetProfile(userId);
    }
    
    // Use timeout mechanism to prevent hanging - reduced from 10000 to 4000
    const profilePromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    try {
      const { data, error } = await withTimeout(
        profilePromise,
        4000,
        'Profile fetch timed out. Please try again.'
      );
      
      if (error) {
        console.error('Error fetching user profile from Supabase:', error);
        
        // If timeout or network error, try mock profile as fallback
        if (error.message.includes('timeout') || error.message.includes('network')) {
          console.log('Profile fetch timeout detected, falling back to mock profile');
          return await mockGetProfile(userId);
        }
        
        return { data: null, error };
      }
      
      console.log('User profile fetched successfully from Supabase');
      return { data, error: null };
    } catch (timeoutError) {
      console.error('Profile fetch timed out, using mock profile as fallback:', timeoutError);
      return await mockGetProfile(userId);
    }
  } catch (err) {
    console.error('Unexpected error in getUserProfile:', err);
    return { data: null, error: err };
  }
};

/**
 * Update a user profile
 * @param userId User ID
 * @param updates Profile updates
 */
export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  return { data, error };
};

/**
 * Reset password
 * @param email User's email
 */
export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email);
};

/**
 * Update user password
 * @param newPassword New password
 */
export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({ password: newPassword });
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<{ user: User | null, error: any }> => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user || null, error };
};
