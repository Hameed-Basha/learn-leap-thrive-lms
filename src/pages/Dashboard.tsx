
import { PageContainer } from '@/components/Layout/PageContainer';
import { StudentDashboard } from '@/components/Dashboard/StudentDashboard';
import { InstructorDashboard } from '@/components/Dashboard/InstructorDashboard';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };
  
  return (
    <PageContainer title="Dashboard">
      {renderDashboard()}
    </PageContainer>
  );
};

export default Dashboard;
