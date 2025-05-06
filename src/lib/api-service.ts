
import { Class, Student, User } from '@/types';

// Mock data
const STUDENTS: Student[] = [
  { 
    id: '2', 
    name: 'Jane Doe', 
    email: 'student@example.com',
    major: 'Computer Science',
    year: 2,
    studentId: 'CS20220002'
  },
  { 
    id: '3', 
    name: 'Alex Johnson', 
    email: 'alex@example.com',
    major: 'Mathematics',
    year: 3,
    studentId: 'MT20210003'
  },
  { 
    id: '4', 
    name: 'Maria Garcia', 
    email: 'maria@example.com',
    major: 'Physics',
    year: 2,
    studentId: 'PH20220004'
  },
  { 
    id: '5', 
    name: 'Sam Lee', 
    email: 'sam@example.com',
    major: 'Chemistry',
    year: 4,
    studentId: 'CH20190005'
  },
];

const CLASSES: Class[] = [
  {
    id: '1',
    subject: 'Advanced Mathematics',
    date: '2025-05-10',
    time: '09:00',
    duration: 60,
    teacherId: '1',
    studentIds: ['2', '3'],
    room: 'Hall 101',
    description: 'Covering linear algebra and calculus topics',
    category: 'Mathematics'
  },
  {
    id: '2',
    subject: 'Quantum Physics',
    date: '2025-05-10',
    time: '11:00',
    duration: 90,
    teacherId: '1',
    studentIds: ['2', '4'],
    room: 'Lab 203',
    description: 'Introduction to quantum mechanics',
    category: 'Science'
  },
  {
    id: '3',
    subject: 'Organic Chemistry',
    date: '2025-05-10',
    time: '14:00',
    duration: 60,
    teacherId: '1',
    studentIds: ['3', '5'],
    room: 'Lab 105',
    description: 'Study of carbon compounds and reactions',
    category: 'Science'
  },
  {
    id: '4',
    subject: 'Data Structures',
    date: '2025-05-11',
    time: '10:00',
    duration: 120,
    teacherId: '1',
    studentIds: ['2', '4'],
    room: 'Computer Lab 302',
    description: 'Algorithms and data structures fundamentals',
    category: 'Computer Science'
  },
  {
    id: '5',
    subject: 'Literary Analysis',
    date: '2025-05-12',
    time: '13:00',
    duration: 60,
    teacherId: '1',
    studentIds: ['3', '5'],
    room: 'Room 205',
    description: 'Critical analysis of classical literature',
    category: 'Literature'
  }
];

// API methods

// Get classes for a student
export const getStudentClasses = async (studentId: string): Promise<Class[]> => {
  await simulateNetworkDelay();
  return CLASSES.filter(c => c.studentIds.includes(studentId));
};

// Get student classes for a specific date
export const getStudentClassesByDate = async (studentId: string, date: string): Promise<Class[]> => {
  await simulateNetworkDelay();
  const targetDate = new Date(date);
  return CLASSES.filter(c => 
    c.studentIds.includes(studentId) && 
    new Date(c.date).toDateString() === targetDate.toDateString()
  );
};

// Get all classes (for teacher)
export const getAllClasses = async (): Promise<Class[]> => {
  await simulateNetworkDelay();
  return [...CLASSES];
};

// Get all classes for a specific date (for teacher)
export const getClassesByDate = async (date: string): Promise<Class[]> => {
  await simulateNetworkDelay();
  const targetDate = new Date(date);
  return CLASSES.filter(c => new Date(c.date).toDateString() === targetDate.toDateString());
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
