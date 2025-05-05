
import { formatDate } from '@/lib/utils';
import { Class } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllStudents } from '@/lib/api-service';
import { useQuery } from '@tanstack/react-query';

interface ClassesTableProps {
  classes: Class[];
  isLoading: boolean;
  showStudents?: boolean;
}

export const ClassesTable = ({ classes, isLoading, showStudents = false }: ClassesTableProps) => {
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
    enabled: showStudents
  });

  const getStudentNames = (studentIds: string[]) => {
    return studentIds
      .map(id => students.find(s => s.id === id)?.name || 'Unknown')
      .join(', ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Classes...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse text-education-primary">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (classes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Classes Found</CardTitle>
          <CardDescription>There are no scheduled classes at the moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
            <p className="text-muted-foreground">No data to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Classes</CardTitle>
        <CardDescription>
          {classes.length} {classes.length === 1 ? 'class' : 'classes'} scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                {showStudents && <TableHead>Students</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">{classItem.subject}</TableCell>
                  <TableCell>{formatDate(classItem.date)}</TableCell>
                  <TableCell>{classItem.time}</TableCell>
                  <TableCell>{classItem.duration} min</TableCell>
                  {showStudents && (
                    <TableCell className="max-w-[200px] truncate">
                      {getStudentNames(classItem.studentIds)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
