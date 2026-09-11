// src/main/ipc/index.ts
// Atomic Recovery — IPC handler registry

import { ipcMain } from 'electron'
import { registerRecoveryHandlers } from './recovery.handler'
import { registerHabitHandlers } from './habit.handler'
import { registerEmergencyHandlers } from './emergency.handler'
import { registerDailyLogHandlers } from './daily-log.handler'
import { registerIdentityHandlers } from './identity.handler'
import { registerSettingsHandlers } from './settings.handler'
import { registerAnalyticsHandlers } from './analytics.handler'
import { registerPinHandlers } from './pin.handler'
import { registerTaskHandlers } from './task.handler'
import { registerGoalHandlers } from './goal.handler'
import { registerSystemHandlers } from './system.handler'

import { BrowserWindow } from 'electron'

export function registerAllIpcHandlers(): void {
  ipcMain.removeHandler('ping')
  ipcMain.handle('ping', () => 'pong')

  // Window controls (for custom TitleBar)
  ipcMain.removeHandler('window:minimize')
  ipcMain.handle('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })
  ipcMain.removeHandler('window:maximize')
  ipcMain.handle('window:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
  })
  ipcMain.removeHandler('window:close')
  ipcMain.handle('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })
  ipcMain.removeHandler('window:isMaximized')
  ipcMain.handle('window:isMaximized', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return win?.isMaximized() ?? false
  })

  // Register domain handlers
  registerRecoveryHandlers()
  registerHabitHandlers()
  registerEmergencyHandlers()
  registerDailyLogHandlers()
  registerIdentityHandlers()
  registerSettingsHandlers()
  registerAnalyticsHandlers()
  registerPinHandlers()
  registerTaskHandlers()
  registerGoalHandlers()
  registerSystemHandlers()
  
  console.log('[IPC] All handlers registered')
}


