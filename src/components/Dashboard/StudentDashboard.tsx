import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getUserEnrollments, getCompletedCourses, getCourseProgress } from '@/services/enrollmentService';
import { getCourseById, Course } from '@/services/courseService';

interface EnrolledCourse extends Course {
  progress: number;
}

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  completionDate: string;
}

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [learningHours, setLearningHours] = useState(0);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch enrollments
        const { data: enrollmentsData } = await getUserEnrollments(user.id);
        
        if (enrollmentsData) {
          const enrolledCoursesWithProgress: EnrolledCourse[] = [];
          
          // For each enrollment, fetch course details and progress
          for (const enrollment of enrollmentsData) {
            const { data: courseData } = await getCourseById(enrollment.course_id);
            
            if (courseData) {
              // Get progress for this course
              const { progress } = await getCourseProgress(user.id, enrollment.course_id);
              
              enrolledCoursesWithProgress.push({
                ...courseData,
                progress,
              });
            }
          }
          
          setEnrolledCourses(enrolledCoursesWithProgress);
        }
        
        // Fetch completed courses as certificates
        const { data: completedData } = await getCompletedCourses(user.id);
        
        if (completedData) {
          const certificates: Certificate[] = [];
          
          for (const completed of completedData) {
            certificates.push({
              id: completed.id,
              courseId: completed.course_id,
              courseTitle: completed.courses.title,
              completionDate: new Date(completed.completed_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            });
          }
          
          setCompletedCourses(certificates);
        }
        
        // For learning hours - this would need a more complex calculation 
        // based on actual time spent or completed lessons
        // For now, we'll use a placeholder calculation
        setLearningHours(enrolledCourses.length * 3.5);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  // Filter in-progress courses (progress > 0 and < 100)
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100);
  
  if (loading) {
    return <div className="text-center py-6">Loading dashboard data...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressCourses.length} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedCourses.length} certificate{completedCourses.length !== 1 ? 's' : ''} earned
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* In Progress Courses */}
      <div>
        <h3 className="text-lg font-medium mb-4">Continue Learning</h3>
        {inProgressCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {inProgressCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-[#1A3C34] to-[#2A5C54] h-24 flex items-center justify-center px-4">
                  <h3 className="text-white font-semibold text-lg text-center">{course.title}</h3>
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>Instructor: {course.instructor_name || 'Unknown'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="mt-4">
                    <Link 
                      to={`/courses/${course.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">You don't have any courses in progress.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Certificates */}
      {completedCourses.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Your Certificates</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {completedCourses.map(certificate => (
              <Card key={certificate.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      {certificate.courseTitle}
                    </div>
                  </CardTitle>
                  <CardDescription>Completed on {certificate.completionDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/certificates/${certificate.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    View Certificate
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
