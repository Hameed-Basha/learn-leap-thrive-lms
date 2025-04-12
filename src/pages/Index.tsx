import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, BookOpen, Users, Award, ArrowRight, ExternalLink } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <GraduationCap className="h-16 w-16 text-primary mb-4" />,
      title: "Interactive Learning",
      description: "Engage with courses through interactive content, quizzes, and assignments. Our platform makes learning fun and effective."
    },
    {
      icon: <BookOpen className="h-16 w-16 text-primary mb-4" />,
      title: "Diverse Course Library",
      description: "Access a wide range of courses across multiple disciplines and skill levels. Find exactly what you need to grow."
    },
    {
      icon: <Users className="h-16 w-16 text-primary mb-4" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and academic experts in their fields. Get inspired by the best in the business."
    },
    {
      icon: <Award className="h-16 w-16 text-primary mb-4" />,
      title: "Earn Certificates",
      description: "Receive certificates upon course completion to showcase your achievements. Add them to your portfolio and LinkedIn."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1A3C34] to-[#2A5C54] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-pattern-grid"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full text-white mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                Leap into Learning Excellence
              </h1>
              <p className="text-xl text-white/80 max-w-xl mb-8 animate-fade-in animation-delay-200">
                Master new skills with expert-led courses and personalized learning paths. Take the next step in your learning journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto bg-[#00C4B4] hover:bg-[#00A8A0] text-white transition-transform hover:scale-105">
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-[#00C4B4] hover:bg-[#00A8A0] text-white transition-transform hover:scale-105">
                        Start Learning For Free <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/courses">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white bg-[#F1F1F1]/20 hover:bg-[#F1F1F1] hover:text-[#1A3C34] hover:border-transparent">
                        Browse Courses
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-4">
            Learn Smarter, Grow Faster
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines quality content, engaged community, and powerful tools to enhance your learning journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center transform transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              <div className="inline-flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#1A3C34]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-4">
            Your Learning Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your progress, access your courses, and manage your learning journey all in one place.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold mb-6 text-[#1A3C34]">Access Your Personalized Dashboard</h3>
          <p className="text-gray-600 mb-8">
            Your dashboard is the central hub for all your learning activities. Track progress, access courses, and view achievements.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" className="bg-[#F4D03F] hover:bg-[#E1C136] text-[#1A3C34] font-semibold transition-transform hover:scale-105">
              {isAuthenticated ? "Go to Your Dashboard" : "Create Your Dashboard"} <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#1A3C34] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start your learning journey?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Join thousands of learners already on our platform and transform your skills today.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-[#F4D03F] hover:bg-[#E1C136] text-[#1A3C34] font-semibold transition-transform hover:scale-105">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" className="bg-[#F4D03F] hover:bg-[#E1C136] text-[#1A3C34] font-semibold transition-transform hover:scale-105">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
