// A mock auth implementation for testing without Supabase
// This will be used as a fallback when Supabase is unavailable or times out
export const USE_MOCK_AUTH = true; // Enabled as a fallback for when Supabase times out

type UserRole = 'student' | 'instructor' | 'admin';

// Mock user data
const MOCK_USERS = [
  {
    email: 'student@example.com',
    password: 'password',
    id: 'mock-user-1',
    name: 'Test Student',
    role: 'student' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=1' // Added avatar URLs
  },
  {
    email: 'instructor@example.com',
    password: 'password',
    id: 'mock-user-2',
    name: 'Test Instructor',
    role: 'instructor' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    email: 'admin@example.com',
    password: 'password',
    id: 'mock-user-3',
    name: 'Test Admin',
    role: 'admin' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  // Additional common testing users
  {
    email: 'john@example.com',
    password: 'password',
    id: 'mock-user-4',
    name: 'John Doe',
    role: 'student' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    email: 'jane@example.com',
    password: 'password',
    id: 'mock-user-5',
    name: 'Jane Smith',
    role: 'instructor' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    email: 'test@example.com',
    password: 'password',
    id: 'mock-user-6',
    name: 'Test User',
    role: 'student' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  // Add real user accounts here so they work with mock auth
  {
    email: 'fakeacc62003@gmail.com',
    password: 'Password@2025',
    id: 'real-user-1',
    name: 'Hameed',
    role: 'student' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    email: 'rockinghameed610@gmail.com',
    password: 'Password@2025',
    id: 'real-user-2',
    name: 'Basha',
    role: 'instructor' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
];

// Mock login function
export const mockSignIn = async (email: string, password: string) => {
  console.log('MOCK AUTH: Attempting to sign in with:', email);
  
  // Simulate network delay (but keep it short)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Convert email to lowercase for case-insensitive comparison
  const lowerEmail = email.toLowerCase();
  
  // Find user with case-insensitive email comparison
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === lowerEmail && u.password === password);
  
  if (!user) {
    console.log('MOCK AUTH: Invalid credentials');
    
    // Debug information to help identify the issue
    console.log('MOCK AUTH: Available users:', MOCK_USERS.map(u => u.email));
    console.log('MOCK AUTH: Attempted email:', lowerEmail);
    
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
  
  // Simulate network delay (but keep it short)
  await new Promise(resolve => setTimeout(resolve, 100));
  
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
      avatar: user.avatar, // Include avatar in the mock profile data
    },
    error: null
  };
};
