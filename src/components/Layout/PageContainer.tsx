
import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  withSidebar?: boolean;
}

export const PageContainer = ({ 
  children, 
  title,
  withSidebar = true 
}: PageContainerProps) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {isAuthenticated && withSidebar && <Sidebar />}
        
        <main className={`flex-1 ${isAuthenticated && withSidebar ? 'md:ml-64' : ''} pt-16`}>
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
