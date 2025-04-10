
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCourses, mockUsers } from '@/data/mockData';
import { Users, BookOpen, Settings, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/ui/chart';

export const AdminDashboard = () => {
  const totalUsers = mockUsers.length;
  const totalCourses = mockCourses.length;
  const totalStudents = mockUsers.filter(user => user.role === 'student').length;
  const totalInstructors = mockUsers.filter(user => user.role === 'instructor').length;
  
  // Mocked chart data
  const userData = [
    { name: 'Students', value: totalStudents },
    { name: 'Instructors', value: totalInstructors },
    { name: 'Admins', value: totalUsers - totalStudents - totalInstructors },
  ];
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Available courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Learning on the platform
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstructors}</div>
            <p className="text-xs text-muted-foreground">
              Teaching on the platform
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* User Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Breakdown of users by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart 
              data={userData}
              index="name"
              categories={["value"]}
              valueFormatter={(value) => `${value} users`}
              colors={["#9b87f5"]}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Quick Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Admin Quick Actions</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">Manage Users</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Management
              </CardTitle>
              <CardDescription>Review and manage all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">Manage Courses</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <BarChart4 className="h-5 w-5 mr-2" />
                Reports
              </CardTitle>
              <CardDescription>View platform analytics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">View Reports</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Settings className="h-5 w-5 mr-2" />
                Platform Settings
              </CardTitle>
              <CardDescription>Configure system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">Configure Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
