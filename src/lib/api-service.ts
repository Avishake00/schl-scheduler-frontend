
import { Class, Student, User } from '@/types';

// Mock data
const STUDENTS: Student[] = [
  { id: '2', name: 'Jane Doe', email: 'student@example.com' },
  { id: '3', name: 'Alex Johnson', email: 'alex@example.com' },
  { id: '4', name: 'Maria Garcia', email: 'maria@example.com' },
  { id: '5', name: 'Sam Lee', email: 'sam@example.com' },
];

const CLASSES: Class[] = [
  {
    id: '1',
    subject: 'Mathematics',
    date: '2025-05-10',
    time: '09:00',
    duration: 60,
    teacherId: '1',
    studentIds: ['2', '3']
  },
  {
    id: '2',
    subject: 'Physics',
    date: '2025-05-12',
    time: '11:00',
    duration: 90,
    teacherId: '1',
    studentIds: ['2', '4']
  },
  {
    id: '3',
    subject: 'Chemistry',
    date: '2025-05-15',
    time: '14:00',
    duration: 60,
    teacherId: '1',
    studentIds: ['3', '5']
  }
];

// API methods

// Get classes for a student
export const getStudentClasses = async (studentId: string): Promise<Class[]> => {
  await simulateNetworkDelay();
  return CLASSES.filter(c => c.studentIds.includes(studentId));
};

// Get all classes (for teacher)
export const getAllClasses = async (): Promise<Class[]> => {
  await simulateNetworkDelay();
  return [...CLASSES];
};

// Get all students (for teacher)
export const getAllStudents = async (): Promise<Student[]> => {
  await simulateNetworkDelay();
  return [...STUDENTS];
};

// Create a new class
export const createClass = async (classData: Omit<Class, 'id'>): Promise<Class> => {
  await simulateNetworkDelay();
  const newClass: Class = {
    id: Math.random().toString(36).substr(2, 9),
    ...classData
  };
  
  CLASSES.push(newClass);
  return newClass;
};

// Helper function to simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));
