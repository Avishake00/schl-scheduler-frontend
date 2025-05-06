
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient for the dashboard routes
const dashboardQueryClient = new QueryClient();

export const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <QueryClientProvider client={dashboardQueryClient}>
      {user.role === 'teacher' ? (
        <TeacherDashboard />
      ) : user.role === 'student' ? (
        <StudentDashboard />
      ) : (
        <Navigate to="/login" replace />
      )}
    </QueryClientProvider>
  );
};
