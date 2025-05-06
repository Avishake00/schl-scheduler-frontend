
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ClassScheduleForm } from '@/components/dashboard/ClassScheduleForm';
import { ClassesTable } from '@/components/dashboard/ClassesTable';
import { getAllClasses } from '@/lib/api-service';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentManagement } from '@/components/dashboard/StudentManagement';

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
        
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="classes">Class Management</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classes" className="space-y-6">
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
                  enableSearch={true}
                />
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
