// A very simple mock auth implementation for testing without Supabase
// Set this to false to use real Supabase authentication
export const USE_MOCK_AUTH = false;

type UserRole = 'student' | 'instructor' | 'admin';

// Mock user data
const MOCK_USERS = [
  {
    email: 'student@example.com',
    password: 'password',
    id: 'mock-user-1',
    name: 'Test Student',
    role: 'student' as UserRole
  },
  {
    email: 'instructor@example.com',
    password: 'password',
    id: 'mock-user-2',
    name: 'Test Instructor',
    role: 'instructor' as UserRole
  },
  {
    email: 'admin@example.com',
    password: 'password',
    id: 'mock-user-3',
    name: 'Test Admin',
    role: 'admin' as UserRole
  },
  // Additional common testing users
  {
    email: 'john@example.com',
    password: 'password',
    id: 'mock-user-4',
    name: 'John Doe',
    role: 'student' as UserRole
  },
  {
    email: 'jane@example.com',
    password: 'password',
    id: 'mock-user-5',
    name: 'Jane Smith',
    role: 'instructor' as UserRole
  },
  {
    email: 'test@example.com',
    password: 'password',
    id: 'mock-user-6',
    name: 'Test User',
    role: 'student' as UserRole
  }
];

// Mock login function
export const mockSignIn = async (email: string, password: string) => {
  console.log('MOCK AUTH: Attempting to sign in with:', email);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('MOCK AUTH: Invalid credentials');
    return {
      data: null,
      error: new Error('Invalid email or password')
    };
  }
  
  console.log('MOCK AUTH: Login successful for user:', user.name);
  
  // Create a mock session and user object similar to Supabase's structure
  const mockData = {
    session: {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() + 3600000 // 1 hour from now
    },
    user: {
      id: user.id,
      email: user.email,
      user_metadata: {
        name: user.name,
        role: user.role
      }
    }
  };
  
  return {
    data: mockData,
    error: null
  };
};

// Mock get profile function
export const mockGetProfile = async (userId: string) => {
  console.log('MOCK AUTH: Fetching profile for user ID:', userId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = MOCK_USERS.find(u => u.id === userId);
  
  if (!user) {
    console.log('MOCK AUTH: User profile not found');
    return {
      data: null,
      error: new Error('User profile not found')
    };
  }
  
  console.log('MOCK AUTH: Profile found for user:', user.name);
  
  return {
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    error: null
  };
}; 