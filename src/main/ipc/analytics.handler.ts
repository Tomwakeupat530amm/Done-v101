// src/main/ipc/analytics.handler.ts
import { ipcMain } from 'electron'
import { analyticsService } from '../services/analytics.service'

export function registerAnalyticsHandlers(): void {
  ipcMain.handle('analytics:getMoodTrend', async (_event, days?: number) => {
    return analyticsService.getMoodTrend(days ?? 7)
  })

  ipcMain.handle('analytics:getHabitWeekStats', async () => {
    return analyticsService.getHabitWeekStats()
  })

  ipcMain.handle('analytics:getRecoverySummary', async () => {
    return analyticsService.getRecoverySummary()
  })

  ipcMain.handle('analytics:getJournalStreak', async () => {
    return analyticsService.getJournalStreak()
  })

  console.log('[IPC] Analytics handlers registered')
}
