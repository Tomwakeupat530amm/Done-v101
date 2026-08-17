// src/main/index.ts
// Atomic Recovery — Main Process Entry

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { registerAllIpcHandlers } from './ipc'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { disconnectPrisma, getPrismaClient } from './database/prisma.client'

import { registerEmergencyShortcut, unregisterEmergencyShortcut } from './ipc/emergency.handler'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false, // Frameless — custom TitleBar
    backgroundColor: '#0A0A0F',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer in dev, file:// in production
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Register emergency shortcut
  registerEmergencyShortcut(mainWindow)
}

// ─── IPC Handlers ──────────────────────────────────────────────

function registerIpcHandlers(): void {

  // Ping test
  ipcMain.handle('ping', () => 'pong')

  // Window controls (for custom TitleBar)
  ipcMain.handle('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })
  ipcMain.handle('window:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })
  ipcMain.handle('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })
  ipcMain.handle('window:isMaximized', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return win?.isMaximized() ?? false
  })


  console.log('[IPC] Core handlers registered')
}

// ─── App Lifecycle ─────────────────────────────────────────────

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.atomic-recovery')

  // Initialize database
  try {
    const prisma = getPrismaClient()
    // Quick connectivity check
    await prisma.$queryRaw`SELECT 1`
    console.log('[DB] Database connected successfully')
  } catch (error) {
    console.error('[DB] Database connection failed:', error)
  }

  // Register all IPC handlers before creating window
  registerIpcHandlers()
  registerAllIpcHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  unregisterEmergencyShortcut()
})

app.on('window-all-closed', async () => {
  await disconnectPrisma()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
