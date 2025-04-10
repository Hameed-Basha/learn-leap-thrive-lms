
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCourses } from '@/data/mockData';
import { Users, BookOpen, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart } from '@/components/ui/chart';

export const InstructorDashboard = () => {
  // For a real application, this would filter based on the logged-in instructor
  const instructorCourses = mockCourses;
  const totalStudents = instructorCourses.reduce((acc, course) => acc + course.enrollmentCount, 0);
  const avgRating = 4.7; // Mocked data
  
  // Mocked chart data
  const data = [
    { name: 'Web Dev', students: 135 },
    { name: 'JavaScript', students: 98 },
    { name: 'React', students: 212 },
    { name: 'Node.js', students: 87 },
  ];
  
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
              Across {instructorCourses.length} courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instructorCourses.length}</div>
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
            <BarChart 
              data={data}
              index="name"
              categories={["students"]}
              valueFormatter={(value) => `${value} students`}
              colors={["#9b87f5"]}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Your Courses */}
      <div>
        <h3 className="text-lg font-medium mb-4">Your Courses</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructorCourses.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">{course.title}</CardTitle>
                <CardDescription>{course.enrollmentCount} students enrolled</CardDescription>
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
