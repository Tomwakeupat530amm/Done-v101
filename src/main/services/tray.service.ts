// src/main/services/tray.service.ts
import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

export class TrayService {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow | null = null

  init(mainWindow: BrowserWindow): void {
    this.mainWindow = mainWindow

    // Create tray icon (16x16 or scaled icon)
    try {
      const candidates = [
        join(process.resourcesPath, 'icon.png'),
        join(process.resourcesPath, 'app.asar.unpacked', 'resources', 'icon.png'),
        join(__dirname, '../../resources/icon.png'),
        join(process.cwd(), 'resources', 'icon.png')
      ]

      const resolvedIconPath = candidates.find((p) => fs.existsSync(p)) || ''

      let image = resolvedIconPath
        ? nativeImage.createFromPath(resolvedIconPath)
        : nativeImage.createEmpty()

      if (image.isEmpty()) {
        console.warn('[TrayService] Icon image is empty, creating fallback 16x16 icon')
        image = nativeImage.createFromBuffer(
          Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAD9JREFUOE9jZKAQMFKon2HUAAYGBoa/DAwM//8zMDCim4FmABmGaoBhqAY4gNRA0X+GBhiGKqYGA2wGkGs4mAcAmxQLu37Qd/UAAAAASUVORK5CYII=',
            'base64'
          )
        )
      }

      const trayIcon = image.resize({ width: 16, height: 16 })
      this.tray = new Tray(trayIcon)

      this.updateContextMenu()
      this.tray.setToolTip('Done - Habit & Productivity Tracker')

      this.tray.on('click', () => {
        this.toggleMainWindow()
      })
      this.tray.on('double-click', () => {
        this.showMainWindow()
      })
    } catch (err) {
      console.warn('[TrayService] Failed to initialize system tray:', err)
    }
  }

  toggleMainWindow(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return
    if (this.mainWindow.isVisible() && !this.mainWindow.isMinimized()) {
      if (process.platform === 'darwin') {
        this.mainWindow.hide()
      } else {
        this.mainWindow.minimize()
      }
    } else {
      this.showMainWindow()
    }
  }

  showMainWindow(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return
    if (this.mainWindow.isMinimized()) this.mainWindow.restore()
    this.mainWindow.show()
    this.mainWindow.focus()
  }

  updatePomodoroStatus(timeLeftFormatted: string | null, isRunning: boolean): void {
    if (!this.tray) return

    if (isRunning && timeLeftFormatted) {
      if (process.platform === 'darwin') {
        this.tray.setTitle(`🍅 ${timeLeftFormatted}`)
      }
      this.tray.setToolTip(`Done - 🍅 Đang tập trung: ${timeLeftFormatted}`)
    } else {
      if (process.platform === 'darwin') {
        this.tray.setTitle('')
      }
      this.tray.setToolTip('Done - Sẵn sàng cho phiên mới')
    }
  }

  updateContextMenu(): void {
    if (!this.tray) return

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Mở Done',
        click: () => this.showMainWindow()
      },
      {
        label: '🚨 Kích hoạt Hỗ trợ Cơn thèm (SOS)',
        click: () => {
          this.showMainWindow()
          this.mainWindow?.webContents.send('emergency:activated')
        }
      },
      { type: 'separator' },
      {
        label: 'Thoát ứng dụng',
        click: () => {
          app.quit()
        }
      }
    ])

    this.tray.setContextMenu(contextMenu)
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }
}

export const trayService = new TrayService()
