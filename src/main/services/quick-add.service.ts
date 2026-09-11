// src/main/services/quick-add.service.ts
import { globalShortcut, BrowserWindow } from 'electron'

export class QuickAddService {
  private shortcut = 'CommandOrControl+Shift+Space'
  private mainWindow: BrowserWindow | null = null

  register(mainWindow: BrowserWindow): void {
    this.mainWindow = mainWindow

    try {
      globalShortcut.unregister(this.shortcut)
    } catch (_) {}

    const success = globalShortcut.register(this.shortcut, () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore()
        this.mainWindow.show()
        this.mainWindow.focus()
        this.mainWindow.webContents.send('quick-add:open')
      }
    })

    if (success) {
      console.log(`[QuickAddService] Global shortcut ${this.shortcut} registered`)
    } else {
      console.warn(`[QuickAddService] Could not register ${this.shortcut}`)
    }
  }

  unregister(): void {
    try {
      globalShortcut.unregister(this.shortcut)
    } catch (_) {}
  }
}

export const quickAddService = new QuickAddService()
