
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure the required environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure you have connected your Supabase project correctly.');
}

export const supabase = createClient(
  supabaseUrl || '',  // Provide fallback empty string to prevent initialization errors
  supabaseAnonKey || ''  // Provide fallback empty string to prevent initialization errors
);
