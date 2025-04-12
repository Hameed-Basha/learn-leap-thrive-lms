import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart } from '@/components/ui/bar-chart';
import { useAuth } from '@/context/AuthContext';
import { getInstructorCourses, Course } from '@/services/courseService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ['instructorCourses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await getInstructorCourses(user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
  
  // Calculate stats
  const totalStudents = courses?.reduce((acc, course) => acc + (course.enrollment_count || 0), 0) || 0;
  const avgRating = 4.7; // Will be calculated from reviews in a real app
  
  // Prepare chart data from actual courses
  const chartData = courses?.slice(0, 5).map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    students: course.enrollment_count || 0
  })) || [];
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {courses?.length || 0} courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              From student reviews
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Enrollment Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Student Enrollments</CardTitle>
          <CardDescription>Total enrollments per course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartData.length > 0 ? (
              <BarChart 
                data={chartData}
                index="name"
                categories={["students"]}
                valueFormatter={(value) => `${value} students`}
                colors={["#9b87f5"]}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No enrollment data available yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Your Courses */}
      <div>
        <h3 className="text-lg font-medium mb-4">Your Courses</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-[#1A3C34] to-[#2A5C54] h-24 flex items-center justify-center px-4">
                <h3 className="text-white font-semibold text-lg text-center">{course.title}</h3>
              </div>
              <CardHeader>
                <CardTitle className="text-base">{course.title}</CardTitle>
                <CardDescription>{course.enrollment_count || 0} students enrolled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/courses/${course.id}/manage`}
                    className="text-primary hover:underline text-sm"
                  >
                    Manage Course
                  </Link>
                  <Link
                    to={`/courses/${course.id}/stats`}
                    className="text-muted-foreground hover:text-gray-700 text-sm"
                  >
                    View Stats
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Course Card */}
          <Card className="border-dashed border-2 hover:border-primary/50 cursor-pointer flex flex-col justify-center items-center h-full">
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-center">Create New Course</h3>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Design, build and publish your new course
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
