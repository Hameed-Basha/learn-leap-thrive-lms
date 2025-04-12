
import { LoginForm } from '@/components/Auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a console log to track authentication state
    console.log('Login page - Authentication state:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">LearnLeap</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue learning
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
