
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug authentication state
  useEffect(() => {
    console.log('LoginForm - Authentication state:', isAuthenticated);
    console.log('LoginForm - User:', user);
    
    // Redirect if already logged in
    if (isAuthenticated && user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) {
      console.log('Login already in progress, ignoring click');
      return;
    }
    
    // Form validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('Attempting login for:', email);
      
      const { error } = await login(email, password);
      
      if (error) {
        console.error('Login form error:', error);
        
        // Show a more user-friendly error message
        if (error.message?.includes('timed out')) {
          setErrorMessage('Login is taking longer than expected. Please try again.');
        } else {
          setErrorMessage(error.message || 'Invalid email or password. Please try again.');
        }
        
        setIsLoading(false);
        return;
      }
      
      console.log('Login successful, redirecting to dashboard');
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      // Give a small delay to allow auth state to update, then redirect
      setTimeout(() => {
        setIsLoading(false); // Ensure loading is reset even if navigation fails
        navigate('/dashboard');
      }, 300);
      
    } catch (error: any) {
      console.error('Unexpected login form error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Test credentials helper
  const fillTestCredentials = (userType: 'student' | 'instructor' | 'admin') => {
    switch(userType) {
      case 'student':
        setEmail('fakeacc62003@gmail.com');
        setPassword('Password@2025');
        break;
      case 'instructor':
        setEmail('rockinghameed610@gmail.com');
        setPassword('Password@2025');
        break;
      case 'admin':
        setEmail('admin@example.com');
        setPassword('password');
        break;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Log in to your account</h2>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <a href="/reset-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
      
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
      
      {/* Quick access buttons for testing */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500 mb-2">Quick access (for testing)</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button 
            type="button"
            onClick={() => fillTestCredentials('student')}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            disabled={isLoading}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => fillTestCredentials('instructor')}
            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
            disabled={isLoading}
          >
            Instructor
          </button>
          <button 
            type="button"
            onClick={() => fillTestCredentials('admin')}
            className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
            disabled={isLoading}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};
