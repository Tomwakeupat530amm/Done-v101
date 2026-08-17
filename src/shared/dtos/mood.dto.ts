// src/shared/dtos/mood.dto.ts
import { z } from 'zod'

export const LogMoodDtoSchema = z.object({
  date: z.string(), // "YYYY-MM-DD"
  period: z.string(), // MoodPeriod e.g., "MORNING", "AFTERNOON", "EVENING"
  mood: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  anxiety: z.number().min(1).max(5).default(3),
  focus: z.number().min(1).max(5).default(3),
  emotionTags: z.array(z.string()).default([]),
  note: z.string().optional().nullable()
})

export type LogMoodDto = z.infer<typeof LogMoodDtoSchema>
