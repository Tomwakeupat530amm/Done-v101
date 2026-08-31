// src/shared/types/ipc.types.ts
// Atomic Recovery — Full IPC Channel Type Definitions

import type { StreakDisplay, RelapseEvent, UrgeLog, UrgeStats, Milestone } from './recovery.types'
import type { HabitWithStreak, HabitLog, TodayHabitStatus, HabitStreak } from './habit.types'
import type { DailyLog } from './daily-log.types'
import type { IdentityProfile, FutureSelf, IdentityStatement } from './identity.types'

// Import DTOs for local use
import type { LogUrgeDto } from '../dtos/emergency.dto'
import type { CreateDailyLogDto, UpdateDailyLogDto } from '../dtos/daily-log.dto'
import type { UpdateProfileDto, UpdateFutureSelfDto, CreateStatementDto as AddStatementDto } from '../dtos/identity.dto'

// Re-export DTOs so consumers can import from here
export type { LogUrgeDto } from '../dtos/emergency.dto'
export type { CreateDailyLogDto, UpdateDailyLogDto } from '../dtos/daily-log.dto'
export type { UpdateProfileDto, UpdateFutureSelfDto, CreateStatementDto as AddStatementDto } from '../dtos/identity.dto'

// ─── DTOs inline for IPC ─────────────────────────────────────────
export interface LogRelapseDto {
  triggerType?: string
  triggerNote?: string
  urgeIntensity?: number
  context?: string
  location?: string
  priorActivity?: string
  emotionalState?: string
  recoveryNote?: string
  wasEmergencyUsed?: boolean
}

export interface CreateHabitDto {
  name: string
  description?: string
  icon?: string
  color?: string
  category?: string
  frequency?: string
  scheduledTime?: string
  cue?: string
  routine?: string
  reward?: string
}

export interface UpdateHabitDto {
  name?: string
  description?: string
  icon?: string
  color?: string
  category?: string
  frequency?: string
  scheduledTime?: string
  cue?: string
  routine?: string
  reward?: string
  isArchived?: boolean
  sortOrder?: number
}

// ─── IPC Channel Map ─────────────────────────────────────────────
export interface IpcChannels {
  // Ping test
  ping: { input: void; output: string }

  // Recovery
  'recovery:getStreakDisplay': { input: void; output: StreakDisplay }
  'recovery:getActiveSession': { input: void; output: unknown | null }
  'recovery:logRelapse': { input: LogRelapseDto; output: void }
  'recovery:logUrge': { input: LogUrgeDto; output: UrgeLog }
  'recovery:getRelapseHistory': { input: { limit?: number }; output: RelapseEvent[] }
  'recovery:getMilestones': { input: void; output: Milestone[] }
  'recovery:getUrgeStats': { input: void; output: UrgeStats }

  // Habits
  'habit:getAll': { input: void; output: HabitWithStreak[] }
  'habit:getTodayStatus': { input: void; output: TodayHabitStatus[] }
  'habit:create': { input: CreateHabitDto; output: unknown }
  'habit:update': { input: { id: string; data: UpdateHabitDto }; output: unknown }
  'habit:delete': { input: { id: string }; output: void }
  'habit:checkIn': { input: { id: string; date: string }; output: HabitStreak }
  'habit:getLogs': { input: { id: string; year: number }; output: HabitLog[] }

  // Daily Log
  'dailyLog:getByDate': { input: { date: string }; output: DailyLog | null }
  'dailyLog:getAll': { input: void; output: DailyLog[] }
  'dailyLog:create': { input: CreateDailyLogDto; output: DailyLog }
  'dailyLog:update': { input: { id: string; data: UpdateDailyLogDto }; output: DailyLog }

  // Identity
  'identity:getProfile': { input: void; output: IdentityProfile | null }
  'identity:updateProfile': { input: UpdateProfileDto; output: IdentityProfile }
  'identity:getFutureSelf': { input: void; output: FutureSelf | null }
  'identity:updateFutureSelf': { input: UpdateFutureSelfDto; output: FutureSelf }
  'identity:getStatements': { input: void; output: IdentityStatement[] }
  'identity:addStatement': { input: AddStatementDto; output: IdentityStatement }
  'identity:removeStatement': { input: { id: string }; output: void }
  'identity:reorderStatements': { input: { ids: string[] }; output: void }

  // Settings
  'settings:get': { input: void; output: AppSettings }
  'settings:update': { input: Partial<AppSettings>; output: AppSettings }

  // Analytics
  'analytics:getMoodTrend': { input: number | undefined; output: MoodTrendDay[] }
  'analytics:getHabitWeekStats': { input: void; output: HabitWeekStats }
  'analytics:getRecoverySummary': { input: void; output: RecoverySummary }
  'analytics:getJournalStreak': { input: void; output: JournalStreakData }

  // PIN
  'pin:isEnabled': { input: void; output: boolean }
  'pin:verify': { input: string; output: boolean }
  'pin:set': { input: string; output: { success: boolean } }
  'pin:disable': { input: void; output: { success: boolean } }
}

// ─── Window API type (exposed to renderer) ───────────────────────
export interface WindowApi {
  ping: () => Promise<string>
  recovery: {
    getStreakDisplay: () => Promise<StreakDisplay>
    getActiveSession: () => Promise<unknown | null>
    logRelapse: (dto: LogRelapseDto) => Promise<void>
    logUrge: (dto: LogUrgeDto) => Promise<UrgeLog>
    getRelapseHistory: (limit?: number) => Promise<RelapseEvent[]>
    getMilestones: () => Promise<Milestone[]>
    getUrgeStats: () => Promise<UrgeStats>
  }
  habits: {
    getAll: () => Promise<HabitWithStreak[]>
    getTodayStatus: () => Promise<TodayHabitStatus[]>
    create: (dto: CreateHabitDto) => Promise<unknown>
    update: (id: string, data: UpdateHabitDto) => Promise<unknown>
    delete: (id: string) => Promise<void>
    checkIn: (id: string, date: string) => Promise<HabitStreak>
    getLogs: (id: string, year: number) => Promise<HabitLog[]>
  }
  dailyLog: {
    getByDate: (date: string) => Promise<DailyLog | null>
    getAll: () => Promise<DailyLog[]>
    create: (dto: CreateDailyLogDto) => Promise<DailyLog>
    update: (id: string, dto: UpdateDailyLogDto) => Promise<DailyLog>
  }
  identity: {
    getProfile: () => Promise<IdentityProfile | null>
    updateProfile: (dto: UpdateProfileDto) => Promise<IdentityProfile>
    getFutureSelf: () => Promise<FutureSelf | null>
    updateFutureSelf: (dto: UpdateFutureSelfDto) => Promise<FutureSelf>
    getStatements: () => Promise<IdentityStatement[]>
    addStatement: (dto: AddStatementDto) => Promise<IdentityStatement>
    removeStatement: (id: string) => Promise<void>
    reorderStatements: (ids: string[]) => Promise<void>
  }
  settings: {
    get: () => Promise<AppSettings>
    update: (data: Partial<AppSettings>) => Promise<AppSettings>
  }
  analytics: {
    getMoodTrend: (days?: number) => Promise<MoodTrendDay[]>
    getHabitWeekStats: () => Promise<HabitWeekStats>
    getRecoverySummary: () => Promise<RecoverySummary>
    getJournalStreak: () => Promise<JournalStreakData>
  }
  task: {
    getAll: () => Promise<import('./task.types').Task[]>
    getDashboardTasks: () => Promise<import('./task.types').Task[]>
    create: (dto: import('./task.types').CreateTaskDto) => Promise<import('./task.types').Task>
    update: (id: string, dto: import('./task.types').UpdateTaskDto) => Promise<import('./task.types').Task>
    delete: (id: string) => Promise<void>
    updateOrder: (id: string, newStatus: import('./task.types').TaskStatus, newOrder: number) => Promise<import('./task.types').Task>
  }
  pin: {
    isEnabled: () => Promise<boolean>
    verify: (pin: string) => Promise<boolean>
    set: (pin: string) => Promise<{ success: boolean }>
    disable: () => Promise<{ success: boolean }>
  }
  onEmergencyActivated: (callback: () => void) => void
}

// ─── Settings Types ──────────────────────────────────────────────
export interface AppSettings {
  language?: string
  compactMode?: boolean
  emergencyButton?: boolean
  accentColor?: string
  morningReminder?: string
  eveningReminder?: string
  showSensitiveContent?: boolean
  pinEnabled?: boolean
  [key: string]: unknown
}

// ─── Analytics Types ──────────────────────────────────────────────
export interface MoodTrendDay {
  date: string
  avgMood: number | null
  avgEnergy: number | null
  count: number
}

export interface HabitWeekStats {
  completionRate: number
  totalCompleted: number
  totalPossible: number
  habitCount: number
  byDay: { date: string; completed: number; total: number }[]
}

export interface RecoverySummary {
  isActive: boolean
  startedAt: Date | null
  milestonesEarned: number
  nextMilestone: number | null
  longestStreak: number
  totalRelapses: number
  urgeStats: { total: number; resisted: number; relapsed: number; resistanceRate: number }
}

export interface JournalStreakData {
  streak: number
  totalEntries: number
}
