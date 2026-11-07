// src/main/services/widget.service.ts
// Floating task widget: a small always-on-top window listing today's / overdue Kanban tasks.

import { app, BrowserWindow, screen, shell } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import { is } from '@electron-toolkit/utils'

interface WidgetState {
  x?: number
  y?: number
  width: number
  height: number
  pinned: boolean
}

const DEFAULT_STATE: WidgetState = { width: 340, height: 460, pinned: true }
const MARGIN = 16

export class WidgetService {
  private window: BrowserWindow | null = null
  private state: WidgetState = { ...DEFAULT_STATE }
  private stateLoaded = false
  private saveTimer: NodeJS.Timeout | null = null

  // ─── Persistence (userData/widget-state.json) ─────────────────
  private get statePath(): string {
    return join(app.getPath('userData'), 'widget-state.json')
  }

  private loadState(): void {
    if (this.stateLoaded) return
    this.stateLoaded = true
    try {
      const raw = fs.readFileSync(this.statePath, 'utf-8')
      const parsed = JSON.parse(raw) as Partial<WidgetState>
      this.state = { ...DEFAULT_STATE, ...parsed }
    } catch {
      this.state = { ...DEFAULT_STATE }
    }
  }

  private saveState(): void {
    try {
      fs.writeFileSync(this.statePath, JSON.stringify(this.state), 'utf-8')
    } catch (err) {
      console.warn('[WidgetService] Could not save widget state:', err)
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer)
    this.saveTimer = setTimeout(() => this.saveState(), 400)
  }

  // Saved position must still be visible on one of the connected displays.
  private resolveBounds(): Electron.Rectangle {
    const { width, height } = this.state
    if (typeof this.state.x === 'number' && typeof this.state.y === 'number') {
      const saved = { x: this.state.x, y: this.state.y, width, height }
      const visible = screen.getAllDisplays().some((d) => {
        const a = d.workArea
        return (
          saved.x + 60 > a.x &&
          saved.x < a.x + a.width - 60 &&
          saved.y >= a.y &&
          saved.y < a.y + a.height - 40
        )
      })
      if (visible) return saved
    }
    const area = screen.getPrimaryDisplay().workArea
    return {
      x: area.x + area.width - width - MARGIN,
      y: area.y + area.height - height - MARGIN,
      width,
      height
    }
  }

  // ─── Window lifecycle ─────────────────────────────────────────
  private create(): BrowserWindow {
    this.loadState()
    const bounds = this.resolveBounds()

    const win = new BrowserWindow({
      ...bounds,
      minWidth: 300,
      minHeight: 280,
      show: false,
      frame: false,
      resizable: true,
      maximizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      alwaysOnTop: this.state.pinned,
      title: 'Done Widget',
      backgroundColor: '#0A0A0F',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    win.on('moved', () => this.rememberBounds(win))
    win.on('resized', () => this.rememberBounds(win))
    win.on('closed', () => {
      if (this.window === win) this.window = null
    })

    win.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/widget`)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/widget' })
    }

    this.window = win
    return win
  }

  private rememberBounds(win: BrowserWindow): void {
    if (win.isDestroyed()) return
    const b = win.getBounds()
    this.state = { ...this.state, x: b.x, y: b.y, width: b.width, height: b.height }
    this.scheduleSave()
  }

  private ensure(): BrowserWindow {
    if (this.window && !this.window.isDestroyed()) return this.window
    return this.create()
  }

  show(): void {
    const win = this.ensure()
    const reveal = (): void => {
      if (win.isDestroyed()) return
      win.showInactive()
    }
    if (win.webContents.isLoading()) {
      win.once('ready-to-show', reveal)
    } else {
      reveal()
    }
  }

  hide(): void {
    if (this.window && !this.window.isDestroyed()) this.window.hide()
  }

  toggle(): void {
    if (this.isVisible()) this.hide()
    else this.show()
  }

  isVisible(): boolean {
    return !!this.window && !this.window.isDestroyed() && this.window.isVisible()
  }

  destroy(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
      this.saveTimer = null
      if (this.stateLoaded) this.saveState()
    }
    if (this.window && !this.window.isDestroyed()) this.window.destroy()
    this.window = null
  }

  // ─── Pin (always on top) ──────────────────────────────────────
  isPinned(): boolean {
    this.loadState()
    return this.state.pinned
  }

  setPinned(pinned: boolean): boolean {
    this.loadState()
    this.state.pinned = pinned
    if (this.window && !this.window.isDestroyed()) this.window.setAlwaysOnTop(pinned)
    this.saveState()
    return pinned
  }

  // ─── Main window ↔ widget switching ───────────────────────────
  minimizeToWidget(mainWindow: BrowserWindow | null | undefined): void {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.hide()
    this.show()
  }

  openMainWindow(mainWindow: BrowserWindow | null | undefined): void {
    if (!mainWindow || mainWindow.isDestroyed()) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
    // main window 'show' listener also hides the widget; keep explicit for safety
    this.hide()
  }

  // ─── Cross-window sync ────────────────────────────────────────
  broadcastTasksChanged(): void {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send('tasks:changed')
    }
  }

  // ─── Launch at login ──────────────────────────────────────────
  private autoLaunchSupported(): boolean {
    return !is.dev && (process.platform === 'win32' || process.platform === 'darwin')
  }

  // Portable builds run from a temp dir; the login item must point at the real .exe
  private loginItemPath(): string {
    return process.env.PORTABLE_EXECUTABLE_FILE || process.execPath
  }

  getAutoLaunch(): { supported: boolean; enabled: boolean } {
    if (!this.autoLaunchSupported()) return { supported: false, enabled: false }
    const opts =
      process.platform === 'win32' ? { path: this.loginItemPath(), args: ['--hidden'] } : {}
    return { supported: true, enabled: app.getLoginItemSettings(opts).openAtLogin }
  }

  setAutoLaunch(enabled: boolean): { supported: boolean; enabled: boolean } {
    if (!this.autoLaunchSupported()) return { supported: false, enabled: false }
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: this.loginItemPath(),
      args: ['--hidden']
    })
    return this.getAutoLaunch()
  }

  wasLaunchedHidden(): boolean {
    if (process.argv.includes('--hidden')) return true
    try {
      return process.platform === 'darwin' && app.getLoginItemSettings().wasOpenedAtLogin
    } catch {
      return false
    }
  }
}

export const widgetService = new WidgetService()
