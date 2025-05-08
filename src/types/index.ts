
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Class {
  _id: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // in minutes
  teacherId: string;
  studentIds: string[];
  room?: string;
  description?: string;
  materials?: string[];
  category?: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  major?: string;
  year?: number;
  studentId?: string;
}

export interface TimeTableEntry {
  id: string;
  subject: string;
  time: string;
  duration: number;
  room?: string;
  teacher?: string;
}

export interface DailyTimetable {
  date: string;
  classes: TimeTableEntry[];
}
