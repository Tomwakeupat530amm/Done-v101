// src/shared/types/emergency.types.ts
export interface UrgeLog {
  id: string
  loggedAt: Date | string
  intensity: number
  triggerType: string | null
  contextNote: string | null
  location: string | null
  priorActivity: string | null
  durationMinutes: number | null
  outcome: string
  strategyUsed: string | null
  emergencyUsed: boolean
  timerMinutes: number | null
}
