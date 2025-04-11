
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, User, Settings, BookOpen, HelpCircle, Info } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-white fixed w-full z-30 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-[#00C4B4] font-bold text-2xl">LearnLeap</span>
              <span className="hidden md:block text-xs text-gray-500 ml-2">Your Path to Mastery</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/courses" 
              className={`text-gray-600 hover:text-[#00C4B4] px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                location.pathname === '/courses' ? 'text-[#00C4B4]' : ''
              }`}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Courses
            </Link>
            <Link 
              to="/about" 
              className={`text-gray-600 hover:text-[#00C4B4] px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                location.pathname === '/about' ? 'text-[#00C4B4]' : ''
              }`}
            >
              <Info className="h-4 w-4 mr-1" />
              About Us
            </Link>
            <Link 
              to="/support" 
              className={`text-gray-600 hover:text-[#00C4B4] px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                location.pathname === '/support' ? 'text-[#00C4B4]' : ''
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Support
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-gray-600 hover:text-[#00C4B4] px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/dashboard' ? 'text-[#00C4B4]' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-[#00C4B4]/20">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-[#00C4B4]/10 text-[#00C4B4]">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-[#00C4B4] text-[#00C4B4] hover:bg-[#00C4B4]/10">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-[#00C4B4] hover:bg-[#00A8A0] text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#00C4B4] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00C4B4]"
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/courses"
              className="text-gray-600 hover:text-[#00C4B4] flex items-center px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Courses
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-[#00C4B4] flex items-center px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-5 w-5 mr-2" />
              About Us
            </Link>
            <Link
              to="/support"
              className="text-gray-600 hover:text-[#00C4B4] flex items-center px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Support
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-[#00C4B4] flex items-center px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-[#00C4B4] flex items-center px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-[#00C4B4] flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full border-[#00C4B4] text-[#00C4B4]">
                    Log in
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-[#00C4B4] hover:bg-[#00A8A0] text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
