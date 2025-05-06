
import { formatDate, getDayOfWeek } from '@/lib/utils';
import { Class } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllStudents } from '@/lib/api-service';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ClassesTableProps {
  classes: Class[];
  isLoading: boolean;
  showStudents?: boolean;
  showDetails?: boolean;
}

export const ClassesTable = ({ 
  classes, 
  isLoading, 
  showStudents = false,
  showDetails = false
}: ClassesTableProps) => {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  {showStudents && <TableHead>Students</TableHead>}
                  <TableHead>Room</TableHead>
                  {showDetails && <TableHead>Category</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <motion.tr
                    key={classItem.id}
                    variants={item}
                    className="font-medium border-b"
                  >
                    <TableCell className="font-medium">
                      <div>
                        {classItem.subject}
                        {showDetails && classItem.description && (
                          <p className="text-xs text-muted-foreground mt-1">{classItem.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(classItem.date)}</span>
                        <span className="text-xs text-muted-foreground">{getDayOfWeek(classItem.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{classItem.time}</TableCell>
                    <TableCell>{classItem.duration} min</TableCell>
                    {showStudents && (
                      <TableCell className="max-w-[200px] truncate">
                        {getStudentNames(classItem.studentIds)}
                      </TableCell>
                    )}
                    <TableCell>
                      {classItem.room || 'TBD'}
                    </TableCell>
                    {showDetails && (
                      <TableCell>
                        {classItem.category && (
                          <Badge variant="outline">{classItem.category}</Badge>
                        )}
                      </TableCell>
                    )}
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
