// src/shared/types/habit.types.ts
// Atomic Recovery — Habit Feature Types

export interface Habit {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  type: string
  frequency: string
  frequencyConfig: string
  scheduledTime: string | null
  category: string
  cue: string | null
  routine: string | null
  reward: string | null
  stackedAfterId: string | null
  isCoreHabit: boolean
  isArchived: boolean
  targetCount: number | null
  targetMinutes: number | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  streak?: HabitStreak | null
}

export interface HabitWithStreak extends Habit {
  streak: HabitStreak | null
  todayLog: HabitLog | null
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
  value: number | null
  note: string | null
  completedAt: Date | null
  createdAt: Date
}

export interface HabitStreak {
  id: string
  habitId: string
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  lastCompletedDate: string | null
  updatedAt: Date
}

export interface TodayHabitStatus {
  habit: Habit
  streak: HabitStreak | null
  todayLog: HabitLog | null
  isCompletedToday: boolean
}
