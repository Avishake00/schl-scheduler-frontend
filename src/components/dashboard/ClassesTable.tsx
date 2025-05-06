
import { formatDate, getDayOfWeek } from '@/lib/utils';
import { Class } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllStudents } from '@/lib/api-service';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClassesTableProps {
  classes: Class[];
  isLoading: boolean;
  showStudents?: boolean;
  showDetails?: boolean;
  enableSearch?: boolean;
}

export const ClassesTable = ({ 
  classes, 
  isLoading, 
  showStudents = false,
  showDetails = false,
  enableSearch = false
}: ClassesTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
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
  
  // Extract unique categories for filter
  const categories = classes
    .map(c => c.category)
    .filter((value, index, self) => value && self.indexOf(value) === index) as string[];
    
  // Filter classes based on search term and category
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = searchTerm === '' || 
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      classItem.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getStudentNames(classItem.studentIds).toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === '' || classItem.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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
          {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {enableSearch && (
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by subject, description, room or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {categories.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        
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
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showDetails ? 7 : 6} className="h-24 text-center">
                      No classes match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((classItem) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
