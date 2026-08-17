// src/shared/types/recovery.types.ts
// Atomic Recovery — Recovery Feature Types

export interface RecoverySession {
  id: string
  startedAt: Date
  endedAt: Date | null
  isActive: boolean
  longestStreak: number
  totalDays: number
  relapses?: RelapseEvent[]
}

export interface RelapseEvent {
  id: string
  sessionId: string
  occurredAt: Date
  triggerType: string | null
  triggerNote: string | null
  urgeIntensity: number | null
  context: string | null
  location: string | null
  priorActivity: string | null
  emotionalState: string | null
  recoveryNote: string | null
  wasEmergencyUsed: boolean
}

export interface UrgeLog {
  id: string
  loggedAt: Date
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

export interface Milestone {
  id: string
  days: number
  type: string
  habitId: string | null
  achievedAt: Date
  note: string | null
  celebrated: boolean
  xpAwarded: number
}

export interface StreakDisplay {
  days: number
  hours: number
  minutes: number
  totalSeconds: number
}

export interface UrgeStats {
  totalUrges: number
  resisted: number
  relapsed: number
  resistanceRate: number
}
