
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ClassesTable } from '@/components/dashboard/ClassesTable';
import { getStudentClasses } from '@/lib/api-service';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['studentClasses', user?.id],
    queryFn: () => getStudentClasses(user?.id || ''),
    enabled: !!user?.id
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name}</CardTitle>
              <CardDescription>View your upcoming classes below</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                You have {classes.length} upcoming {classes.length === 1 ? 'class' : 'classes'} scheduled.
              </p>
            </CardContent>
          </Card>
          
          <ClassesTable 
            classes={classes} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
