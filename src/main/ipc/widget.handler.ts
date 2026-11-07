// src/main/ipc/widget.handler.ts
import { ipcMain, BrowserWindow } from 'electron'
import { widgetService } from '../services/widget.service'

export function registerWidgetHandlers(getMainWindow: () => BrowserWindow | null): void {
  ipcMain.handle('widget:hide', () => {
    widgetService.hide()
  })

  ipcMain.handle('widget:openMain', () => {
    widgetService.openMainWindow(getMainWindow())
  })

  ipcMain.handle('widget:getPinned', () => widgetService.isPinned())

  ipcMain.handle('widget:togglePin', () => widgetService.setPinned(!widgetService.isPinned()))

  ipcMain.handle('widget:getAutoLaunch', () => widgetService.getAutoLaunch())

  ipcMain.handle('widget:setAutoLaunch', (_event, enabled: boolean) =>
    widgetService.setAutoLaunch(!!enabled)
  )
}
