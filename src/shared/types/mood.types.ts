// src/shared/types/mood.types.ts
export interface MoodLog {
  id: string
  date: string
  period: string
  mood: number
  energy: number
  anxiety: number
  focus: number
  emotionTags: string // JSON array
  note: string | null
  loggedAt: Date | string
}
