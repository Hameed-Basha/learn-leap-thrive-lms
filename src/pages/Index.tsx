
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, BookOpen, Users, Award, ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: "Interactive Learning",
      description: "Engage with courses through interactive content, quizzes, and assignments."
    },
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: "Diverse Course Library",
      description: "Access a wide range of courses across multiple disciplines and skill levels."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and academic experts in their fields."
    },
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: "Earn Certificates",
      description: "Receive certificates upon course completion to showcase your achievements."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Unleash Your Learning Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover courses taught by expert instructors and expand your skills with our interactive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            A better way to learn
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines quality content, engaged community, and powerful tools to enhance your learning journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start your learning journey?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Join thousands of learners already on our platform and transform your skills today.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Join For Free
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
