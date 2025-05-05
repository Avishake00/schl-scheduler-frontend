
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ClassScheduleForm } from '@/components/dashboard/ClassScheduleForm';
import { ClassesTable } from '@/components/dashboard/ClassesTable';
import { getAllClasses } from '@/lib/api-service';

const TeacherDashboard = () => {
  const queryClient = useQueryClient();
  
  const { data: classes = [], isLoading, refetch } = useQuery({
    queryKey: ['classes'],
    queryFn: getAllClasses
  });
  
  // Prefetch students for the form
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['students'],
      queryFn: () => import('@/lib/api-service').then(mod => mod.getAllStudents())
    });
  }, [queryClient]);
  
  const handleClassCreated = () => {
    refetch();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ClassScheduleForm onClassCreated={handleClassCreated} />
          
          <div className="space-y-6">
            <ClassesTable 
              classes={classes} 
              isLoading={isLoading}
              showStudents={true}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
