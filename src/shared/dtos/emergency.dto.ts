// src/shared/dtos/emergency.dto.ts
import { z } from 'zod'

export const LogUrgeDtoSchema = z.object({
  intensity: z.number().min(1).max(10),
  triggerType: z.string().optional().nullable(),
  contextNote: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  priorActivity: z.string().optional().nullable(),
  durationMinutes: z.number().optional().nullable(),
  outcome: z.string(), // "RESISTED" | "RELAPSED" | "DISTRACTED"
  strategyUsed: z.string().optional().nullable(),
  emergencyUsed: z.boolean().default(true),
  timerMinutes: z.number().optional().nullable(),
})

export type LogUrgeDto = z.infer<typeof LogUrgeDtoSchema>
