
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  FileText,
  Settings,
  UserCircle,
  BarChart4
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { 
        name: 'Dashboard', 
        path: '/dashboard', 
        icon: <LayoutDashboard size={20} /> 
      },
      { 
        name: 'Courses', 
        path: '/courses', 
        icon: <BookOpen size={20} /> 
      },
      { 
        name: 'Profile', 
        path: '/profile', 
        icon: <UserCircle size={20} /> 
      },
    ];
    
    const studentItems = [
      ...commonItems,
      { 
        name: 'My Learning', 
        path: '/learning', 
        icon: <GraduationCap size={20} /> 
      },
      { 
        name: 'Certificates', 
        path: '/certificates', 
        icon: <FileText size={20} /> 
      },
    ];
    
    const instructorItems = [
      ...commonItems,
      { 
        name: 'My Courses', 
        path: '/my-courses', 
        icon: <BookOpen size={20} /> 
      },
      { 
        name: 'Students', 
        path: '/students', 
        icon: <Users size={20} /> 
      },
      { 
        name: 'Schedule', 
        path: '/schedule', 
        icon: <Calendar size={20} /> 
      },
    ];
    
    const adminItems = [
      ...commonItems,
      { 
        name: 'User Management', 
        path: '/users', 
        icon: <Users size={20} /> 
      },
      { 
        name: 'Reports', 
        path: '/reports', 
        icon: <BarChart4 size={20} /> 
      },
      { 
        name: 'Settings', 
        path: '/settings', 
        icon: <Settings size={20} /> 
      },
    ];
    
    switch (user?.role) {
      case 'student':
        return studentItems;
      case 'instructor':
        return instructorItems;
      case 'admin':
        return adminItems;
      default:
        return commonItems;
    }
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm h-screen fixed pt-16">
      <div className="flex-grow py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-3 rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-accent hover:text-primary"
            )}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="text-xs text-gray-500">
            <p>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};
