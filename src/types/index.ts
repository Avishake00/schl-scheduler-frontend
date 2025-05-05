
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Class {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // in minutes
  teacherId: string;
  studentIds: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
}
