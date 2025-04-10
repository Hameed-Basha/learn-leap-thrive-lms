
import { SignUpForm } from '@/components/Auth/SignUpForm';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">LearnLeap</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform to start your learning journey
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default Register;
