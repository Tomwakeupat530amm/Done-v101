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

  // ─── Daily Log ─────────────────────────────────────────────────
  dailyLog: {
    getByDate: (date: string) => invoke('dailyLog:getByDate', { date }),
    getAll: () => invoke('dailyLog:getAll'),
    getSummary: (date: string) => invoke('dailyLog:getSummary', { date }),
    getAllFeed: () => invoke('dailyLog:getAllFeed'),
    saveMorning: (date: string, morningIntention: string) => invoke('dailyLog:saveMorning', { date, morningIntention }),
    saveEvening: (date: string, reflection: string) => invoke('dailyLog:saveEvening', { date, reflection }),
    create: (dto: unknown) => invoke('dailyLog:create', dto),
    update: (id: string, dto: unknown) => invoke('dailyLog:update', { id, data: dto })
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
    update: (data: unknown) => invoke('settings:update', data),
    exportBackup: () => invoke('settings:exportBackup'),
    importBackup: () => invoke('settings:importBackup'),
    testNotification: () => invoke('settings:testNotification')
  },
  notification: {
    send: (title: string, body: string) => ipcRenderer.invoke('notification:send', title, body)
  },

  // ─── Analytics ────────────────────────────────────────────
  analytics: {
    getMoodTrend: (days?: number) => ipcRenderer.invoke('analytics:getMoodTrend', days),
    getHabitWeekStats: () => ipcRenderer.invoke('analytics:getHabitWeekStats'),
    getRecoverySummary: () => ipcRenderer.invoke('analytics:getRecoverySummary'),
    getJournalStreak: () => ipcRenderer.invoke('analytics:getJournalStreak'),
    getTaskWeekStats: (days?: number) => ipcRenderer.invoke('analytics:getTaskWeekStats', days)
  },
  task: {
    getAll: () => ipcRenderer.invoke('task:getAll'),
    getDashboardTasks: () => ipcRenderer.invoke('task:getDashboardTasks'),
    create: (dto: import('../shared/types/task.types').CreateTaskDto) => ipcRenderer.invoke('task:create', dto),
    update: (id: string, dto: import('../shared/types/task.types').UpdateTaskDto) => ipcRenderer.invoke('task:update', { id, dto }),
    delete: (id: string) => ipcRenderer.invoke('task:delete', id),
    updateOrder: (id: string, newStatus: string, newOrder: number) => ipcRenderer.invoke('task:updateOrder', { id, newStatus, newOrder }),
    incrementPomodoro: (id: string) => ipcRenderer.invoke('task:incrementPomodoro', id)
  },
  goal: {
    getAll: () => ipcRenderer.invoke('goal:getAll'),
    getDueGoals: () => ipcRenderer.invoke('goal:getDueGoals'),
    create: (dto: import('../shared/types/goal.types').CreateGoalDto) => ipcRenderer.invoke('goal:create', dto),
    update: (id: string, dto: import('../shared/types/goal.types').UpdateGoalDto) => ipcRenderer.invoke('goal:update', { id, dto }),
    delete: (id: string) => ipcRenderer.invoke('goal:delete', id),
    markCompleted: (id: string) => ipcRenderer.invoke('goal:markCompleted', id),
    extendTargetDate: (id: string, newTargetDate: string) => ipcRenderer.invoke('goal:extendTargetDate', { id, newTargetDate }),
    markNotified: (id: string) => ipcRenderer.invoke('goal:markNotified', id)
  },
  pin: {
    isEnabled: () => ipcRenderer.invoke('pin:isEnabled'),
    verify: (pin: string) => ipcRenderer.invoke('pin:verify', pin),
    set: (pin: string) => ipcRenderer.invoke('pin:set', pin),
    disable: () => ipcRenderer.invoke('pin:disable')
  },

  // ─── Platform & Desktop Innovations ──────────────────────────
  platform: process.platform,
  tray: {
    updatePomodoro: (timeLeftFormatted: string | null, isRunning: boolean) =>
      ipcRenderer.invoke('tray:updatePomodoro', timeLeftFormatted, isRunning)
  },
  badge: {
    updateDock: (count: number) => ipcRenderer.invoke('badge:updateDock', count),
    updateProgress: (progress: number) => ipcRenderer.invoke('badge:updateProgress', progress)
  },

  // ─── Events ──────────────────────────────────────────────────
  onEmergencyActivated: (callback: () => void) => {
    ipcRenderer.on('emergency:activated', () => callback())
  },
  onQuickAdd: (callback: () => void) => {
    ipcRenderer.on('quick-add:open', () => callback())
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
