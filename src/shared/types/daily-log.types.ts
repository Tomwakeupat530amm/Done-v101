import type { Task } from './task.types';

export interface DailyLog {
  id: string;
  date: string;
  mood: number | null;
  energy: number | null;
  emotionTags: string[];
  morningIntention: string | null;
  gratitude: string[];
  reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletedHabitItem {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  streak: number;
  targetCount: number | null;
  countValue: number | null;
  targetMinutes: number | null;
  durationValue: number | null;
}

export interface DailyAccomplishmentSummary {
  date: string;
  log: DailyLog | null;
  completedTasks: Task[];
  completedHabits: CompletedHabitItem[];
}
