// src/main/ipc/settings.handler.ts
import { ipcMain } from 'electron'
import { settingsService } from '../services/settings.service'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', async () => {
    return await settingsService.getSettings()
  })

  ipcMain.handle('settings:update', async (_event, data: Record<string, unknown>) => {
    return await settingsService.updateSettings(data)
  })

  console.log('[IPC] Settings handlers registered')
}
