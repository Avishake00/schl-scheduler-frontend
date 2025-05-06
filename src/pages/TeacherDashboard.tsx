
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ClassScheduleForm } from '@/components/dashboard/ClassScheduleForm';
import { ClassesTable } from '@/components/dashboard/ClassesTable';
import { getAllClasses } from '@/lib/api-service';
import { motion } from 'framer-motion';

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
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ClassScheduleForm onClassCreated={handleClassCreated} />
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ClassesTable 
              classes={classes} 
              isLoading={isLoading}
              showStudents={true}
              showDetails={true}
            />
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
