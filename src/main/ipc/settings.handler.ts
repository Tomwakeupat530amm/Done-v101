// src/main/ipc/settings.handler.ts
import { ipcMain, BrowserWindow } from 'electron'
import { settingsService } from '../services/settings.service'
import { notificationService } from '../services/notification.service'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', async () => {
    return await settingsService.getSettings()
  })

  ipcMain.handle('settings:update', async (_event, data: Record<string, unknown>) => {
    return await settingsService.updateSettings(data)
  })

  ipcMain.handle('settings:exportBackup', async () => {
    const window = BrowserWindow.getFocusedWindow()
    return await settingsService.exportBackup(window)
  })

  ipcMain.handle('settings:importBackup', async () => {
    const window = BrowserWindow.getFocusedWindow()
    return await settingsService.importBackup(window)
  })

  ipcMain.handle('settings:testNotification', async () => {
    const settings = await settingsService.getSettings()
    return notificationService.sendTestNotification(settings?.language || 'vi')
  })

  ipcMain.handle('notification:send', async (_event, title: string, body: string) => {
    return notificationService.sendCustom(title, body)
  })

  console.log('[IPC] Settings handlers registered')
}

