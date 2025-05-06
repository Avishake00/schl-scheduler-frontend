
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStudentClassesByDate } from '@/lib/api-service';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { downloadTimetable, generateTimetableForDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Download } from 'lucide-react';

export const StudentTimetable = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['studentClasses', user?.id, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => getStudentClassesByDate(
      user?.id || '', 
      format(selectedDate, 'yyyy-MM-dd')
    ),
    enabled: !!user?.id
  });

  const handleDownloadTimetable = () => {
    const timetable = generateTimetableForDate(classes, selectedDate);
    downloadTimetable(timetable);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Timetable</CardTitle>
        <CardDescription>View and download your class schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Date</h3>
              <Button 
                variant="outline" 
                size="sm"
                disabled={classes.length === 0}
                onClick={handleDownloadTimetable}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
            
            <div className="border rounded-md p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="pointer-events-auto"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-education-primary" />
              Classes for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            
            {isLoading ? (
              <div className="h-32 flex items-center justify-center animate-pulse">
                Loading classes...
              </div>
            ) : classes.length === 0 ? (
              <div className="h-32 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">No classes scheduled for this day</p>
              </div>
            ) : (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {classes.map((classItem, index) => (
                  <motion.div
                    key={classItem.id}
                    className="border rounded-md p-4 bg-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{classItem.subject}</h4>
                      <span className="text-sm">{classItem.time} ({classItem.duration} min)</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Room: {classItem.room || 'TBD'}
                    </div>
                    {classItem.description && (
                      <p className="text-sm mt-2">{classItem.description}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
