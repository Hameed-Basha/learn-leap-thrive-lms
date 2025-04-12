import { supabase } from '@/lib/supabase';
import { UserProfile } from './authService';

/**
 * Promote a user to a new role (instructor or admin)
 * Can only be executed by admin users
 * @param userId ID of the user to promote
 * @param newRole The new role to assign to the user
 */
export const promoteUser = async (
  userId: string, 
  newRole: 'student' | 'instructor' | 'admin'
): Promise<{ success: boolean; data?: UserProfile; error?: any }> => {
  try {
    const { data, error } = await supabase
      .rpc('promote_user', {
        target_user_id: userId,
        new_role: newRole
      });
    
    if (error) {
      console.error('Error promoting user:', error);
      return { success: false, error };
    }
    
    if (!data.success) {
      return { success: false, error: data.error };
    }
    
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error in promoteUser:', error);
    return { success: false, error };
  }
};

/**
 * Get all users (for admin dashboard)
 * Can only be executed by admin users
 */
export const getAllUsers = async (): Promise<{ data: UserProfile[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching users:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
};

/**
 * Search for users by name or email
 * Can only be executed by admin users
 * @param query Search query
 */
export const searchUsers = async (query: string): Promise<{ data: UserProfile[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('name');
    
  if (error) {
    console.error('Error searching users:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
};

/**
 * Get user profile by ID
 * Can only be executed by admin users
 * @param userId User ID
 */
export const getUserById = async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
}; 