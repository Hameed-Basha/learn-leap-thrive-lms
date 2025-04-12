import { createClient } from '@supabase/supabase-js';

// Get environment variables from Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add detailed logging for troubleshooting
console.log('=== SUPABASE INITIALIZATION ===');
console.log('VITE_SUPABASE_URL environment variable is set:', !!supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY environment variable is set:', !!supabaseAnonKey);

// Ensure the required environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure you have connected your Supabase project correctly in your .env file.');
  throw new Error('Missing Supabase configuration. Check the console for more information.');
} else {
  console.log('Supabase configuration found, URL:', supabaseUrl);
}

// Add a manual health check to Supabase
const checkSupabaseHealth = async () => {
  try {
    console.log('Performing Supabase health check...');
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`);
    console.log('Supabase health check response status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return false;
  }
};

// Log Supabase health check result
checkSupabaseHealth().then(isHealthy => {
  console.log('Supabase health check result:', isHealthy ? 'HEALTHY' : 'UNHEALTHY');
});

// Create the Supabase client with better options
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'learnleap-auth-token'
    },
    realtime: {
      // Disable realtime subscriptions if not needed
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      // Add fetch options with proper timeout to prevent hanging
      fetch: (url, options) => {
        const timeout = 10000; // 10 seconds timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`Supabase request timed out after ${timeout}ms:`, url);
          controller.abort();
        }, timeout);
        
        console.log('Making Supabase request to:', url);
        return fetch(url, {
          ...options,
          signal: controller.signal,
        })
        .then(response => {
          console.log('Supabase request succeeded:', url);
          return response;
        })
        .catch(error => {
          console.error('Supabase request failed:', url, error);
          throw error;
        })
        .finally(() => clearTimeout(timeoutId));
      }
    }
  }
);

console.log('Supabase client initialized successfully');
