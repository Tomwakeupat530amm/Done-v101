// src/main/ipc/emergency.handler.ts
import { ipcMain, globalShortcut, BrowserWindow } from 'electron'

export function registerEmergencyHandlers(): void {
  // We don't necessarily need a separate logUrge here since recovery:logUrge is already registered.
  // But we can register the global shortcut mechanism.
  
  // No direct IPC calls needed for the shortcut itself, but we can provide a way 
  // for the renderer to manually trigger it if needed (e.g. for testing)
  ipcMain.handle('emergency:trigger', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.webContents.send('emergency:activated')
  })
}

export function registerEmergencyShortcut(mainWindow: BrowserWindow): void {
  const shortcut = 'CommandOrControl+E'
  
  try {
    globalShortcut.unregister(shortcut)
  } catch (_) {}

  const registered = globalShortcut.register(shortcut, () => {
    console.log(`[Emergency] Global shortcut ${shortcut} triggered`)
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
      mainWindow.webContents.send('emergency:activated')
    }
  })

  if (!registered) {
    console.warn('[Emergency] Global shortcut CommandOrControl+E is occupied by another app or instance')
  } else {
    console.log('[Emergency] Global shortcut registered')
  }
}

export function unregisterEmergencyShortcut(): void {
  globalShortcut.unregister('CommandOrControl+E')
}
