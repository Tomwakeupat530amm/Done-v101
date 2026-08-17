// src/preload/index.ts
// Atomic Recovery — Type-safe IPC bridge via contextBridge

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Helper: invoke IPC channel and return result
function invoke<T>(channel: string, data?: unknown): Promise<T> {
  return ipcRenderer.invoke(channel, data)
}

// Full typed API exposed to renderer
const api = {
  // ─── Ping test ───────────────────────────────────────────────
  ping: () => invoke<string>('ping'),

  // ─── Recovery ────────────────────────────────────────────────
  recovery: {
    getStreakDisplay: () => invoke('recovery:getStreakDisplay'),
    getActiveSession: () => invoke('recovery:getActiveSession'),
    logRelapse: (dto: unknown) => invoke('recovery:logRelapse', dto),
    logUrge: (dto: unknown) => invoke('recovery:logUrge', dto),
    getRelapseHistory: (limit?: number) => invoke('recovery:getRelapseHistory', { limit }),
    getMilestones: () => invoke('recovery:getMilestones'),
    getUrgeStats: () => invoke('recovery:getUrgeStats')
  },

  // ─── Habits ──────────────────────────────────────────────────
  habits: {
    getAll: () => invoke('habit:getAll'),
    getTodayStatus: () => invoke('habit:getTodayStatus'),
    create: (dto: unknown) => invoke('habit:create', dto),
    update: (id: string, data: unknown) => invoke('habit:update', { id, data }),
    delete: (id: string) => invoke('habit:delete', { id }),
    checkIn: (id: string, date: string) => invoke('habit:checkIn', { id, date }),
    getLogs: (id: string, year: number) => invoke('habit:getLogs', { id, year })
  },

  // ─── Journal ─────────────────────────────────────────────────
  journal: {
    save: (dto: unknown) => invoke('journal:save', dto),
    getByDate: (date: string) => invoke('journal:getByDate', { date })
  },

  // ─── Mood ────────────────────────────────────────────────────
  mood: {
    log: (dto: unknown) => invoke('mood:log', dto),
    getByDate: (date: string) => invoke('mood:getByDate', { date })
  },

  // ─── Identity ────────────────────────────────────────────────
  identity: {
    getProfile: () => invoke('identity:getProfile'),
    updateProfile: (dto: unknown) => invoke('identity:updateProfile', dto),
    getFutureSelf: () => invoke('identity:getFutureSelf'),
    updateFutureSelf: (dto: unknown) => invoke('identity:updateFutureSelf', dto),
    getStatements: () => invoke('identity:getStatements'),
    addStatement: (dto: unknown) => invoke('identity:addStatement', dto),
    removeStatement: (id: string) => invoke('identity:removeStatement', { id }),
    reorderStatements: (ids: string[]) => invoke('identity:reorderStatements', { ids })
  },

  // ─── Settings ────────────────────────────────────────────────
  settings: {
    get: () => invoke('settings:get'),
    update: (data: unknown) => invoke('settings:update', data)
  },

  // ─── Analytics ────────────────────────────────────────────
  analytics: {
    getMoodTrend: (days?: number) => invoke('analytics:getMoodTrend', days),
    getHabitWeekStats: () => invoke('analytics:getHabitWeekStats'),
    getRecoverySummary: () => invoke('analytics:getRecoverySummary'),
    getJournalStreak: () => invoke('analytics:getJournalStreak')
  },

  // ─── PIN ────────────────────────────────────────────────
  pin: {
    isEnabled: () => invoke<boolean>('pin:isEnabled'),
    verify: (pin: string) => invoke<boolean>('pin:verify', pin),
    set: (pin: string) => invoke<{ success: boolean }>('pin:set', pin),
    disable: () => invoke<{ success: boolean }>('pin:disable')
  },

  // ─── Events ──────────────────────────────────────────────────
  onEmergencyActivated: (callback: () => void) => {
    ipcRenderer.on('emergency:activated', () => callback())
  }
}

// Expose to renderer via contextBridge
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('[Preload] Failed to expose APIs:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
