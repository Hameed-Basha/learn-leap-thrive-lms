
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockCourses, mockCertificates } from '@/data/mockData';
import { GraduationCap, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const enrolledCourses = mockCourses.filter(course => course.progress !== undefined);
  const inProgressCourses = enrolledCourses.filter(course => course.progress && course.progress > 0 && course.progress < 100);
  const completedCourses = mockCertificates.length;
  
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
            <div className="text-2xl font-bold">12.5</div>
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
            <div className="text-2xl font-bold">{completedCourses}</div>
            <p className="text-xs text-muted-foreground">
              {completedCourses} certificate{completedCourses !== 1 ? 's' : ''} earned
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
                <div className="h-40 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>Instructor: {course.instructor}</CardDescription>
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
      {mockCertificates.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Your Certificates</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {mockCertificates.map(certificate => (
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
