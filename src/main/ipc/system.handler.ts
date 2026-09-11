// src/main/ipc/system.handler.ts
import { ipcMain, BrowserWindow } from 'electron'
import { trayService } from '../services/tray.service'
import { badgeService } from '../services/badge.service'

export function registerSystemHandlers(): void {
  ipcMain.handle('tray:updatePomodoro', (_event, timeLeftFormatted: string | null, isRunning: boolean) => {
    trayService.updatePomodoroStatus(timeLeftFormatted, isRunning)
  })

  ipcMain.handle('badge:updateDock', (_event, count: number) => {
    badgeService.updateDockBadge(count)
  })

  ipcMain.handle('badge:updateProgress', (event, progress: number) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    badgeService.updateTaskbarProgress(progress, win)
  })

  ipcMain.handle('system:getPlatform', () => {
    return process.platform
  })
}
