
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is just for development - in production we would call a real API
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('lms_user', JSON.stringify(foundUser));
          resolve(true);
        } else {
          resolve(false);
        }
        setLoading(false);
      }, 800);
    });
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
