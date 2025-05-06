
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isSameDay, parseISO } from "date-fns";
import { Class, DailyTimetable, TimeTableEntry } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'EEEE');
}

export function generateTimetableForDate(classes: Class[], date: Date): DailyTimetable {
  const filteredClasses = classes.filter(cls => isSameDay(parseISO(cls.date), date));
  
  const entries: TimeTableEntry[] = filteredClasses.map(cls => ({
    id: cls.id,
    subject: cls.subject,
    time: cls.time,
    duration: cls.duration,
    room: cls.room || 'TBD',
    teacher: cls.teacherId // This would ideally be the teacher's name
  }));
  
  return {
    date: format(date, 'yyyy-MM-dd'),
    classes: entries.sort((a, b) => a.time.localeCompare(b.time))
  };
}

export function downloadTimetable(timetable: DailyTimetable): void {
  const formattedDate = formatDate(timetable.date);
  const dayOfWeek = getDayOfWeek(timetable.date);
  
  let content = `Timetable for ${dayOfWeek}, ${formattedDate}\n\n`;
  
  timetable.classes.forEach(entry => {
    content += `${entry.time} - ${entry.subject} (${entry.duration} min)\n`;
    content += `Room: ${entry.room || 'TBD'}\n\n`;
  });
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `timetable-${timetable.date}.txt`;
  a.click();
  
  URL.revokeObjectURL(url);
}
