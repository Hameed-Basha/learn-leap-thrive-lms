
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure the required environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure you have connected your Supabase project correctly.');
}

// Create a hardcoded fallback for development only
// In production, these should be removed and only the environment variables should be used
const fallbackUrl = 'https://your-supabase-project.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld2prdnNkdGJrd2d0a2V5b2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAxOTg5ODksImV4cCI6MjAwNTc3NDk4OX0.a_fallback_key_for_development';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
);
