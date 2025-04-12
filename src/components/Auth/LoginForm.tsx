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

  // Redirect if already logged in
  useEffect(() => {
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
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log('Attempting login for:', email);
      
      const { error } = await login(email, password);
      
      if (error) {
        console.error('Login form error:', error);
        setErrorMessage(error.message || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }
      
      console.log('Login successful, redirecting to dashboard');
      
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

  // Mock credential hints for development
  const loginAsStudent = () => {
    setEmail('student@example.com');
    setPassword('password');
    // Simulate form submission
    const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    handleSubmit(mockEvent);
  };
  
  const loginAsInstructor = () => {
    setEmail('instructor@example.com');
    setPassword('password');
    // Simulate form submission
    const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    handleSubmit(mockEvent);
  };
  
  const loginAsAdmin = () => {
    setEmail('admin@example.com');
    setPassword('password');
    // Simulate form submission
    const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    handleSubmit(mockEvent);
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
      
      {/* Development options - These would be removed in production */}
      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-500 text-center mb-4">Development Options:</p>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="sm" onClick={loginAsStudent} disabled={isLoading}>
            Login as Student
          </Button>
          <Button variant="outline" size="sm" onClick={loginAsInstructor} disabled={isLoading}>
            Login as Instructor
          </Button>
          <Button variant="outline" size="sm" onClick={loginAsAdmin} disabled={isLoading}>
            Login as Admin
          </Button>
        </div>
      </div>
    </div>
  );
};
