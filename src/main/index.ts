// src/main/index.ts
// Atomic Recovery — Main Process Entry

import { app, shell, BrowserWindow, Menu } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import { registerAllIpcHandlers } from './ipc'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { disconnectPrisma, getPrismaClient } from './database/prisma.client'
import { notificationService } from './services/notification.service'
import { trayService } from './services/tray.service'
import { quickAddService } from './services/quick-add.service'

import { registerEmergencyShortcut, unregisterEmergencyShortcut } from './ipc/emergency.handler'

let mainWindow: BrowserWindow | null = null
const isMac = process.platform === 'darwin'

function setupApplicationMenu(): void {
  if (isMac) {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          { role: 'close' }
        ]
      }
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    title: 'Done',
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    ...(isMac
      ? {
          titleBarStyle: 'hiddenInset' as const,
          trafficLightPosition: { x: 16, y: 12 },
          vibrancy: 'under-window' as const
        }
      : {
          frame: false,
          backgroundMaterial: 'acrylic' as const
        }),
    backgroundColor: '#0A0A0F',
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
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

// ─── Single Instance Lock & App Lifecycle ───────────────────────

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  console.log('[App] Another instance of Done is already running. Quitting duplicate instance.')
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.atomic-recovery')

    // Initialize database — validate schema before opening the window
    try {
    const prisma = getPrismaClient()
    // Validate the schema is intact by checking a core table
    const rows = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='habits'`
    const tableList = rows as Array<{name: string}>
    
    if (tableList.length === 0) {
      // Table missing → db is corrupt or empty; restore from template
      console.error('[DB] Schema missing! Restoring database from template...')
      await prisma.$disconnect()
      const userDataPath = app.getPath('userData')
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true })
      }
      const dbPath = join(userDataPath, 'atomic-recovery.db')
      const templatePath = join(process.resourcesPath, 'prod.db')
      // Force overwrite regardless of size
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, dbPath)
        console.log('[DB] Database restored from template')
      }
    } else {
      console.log('[DB] Schema validated, habits table found')
      
      // --- AUTO MIGRATIONS FOR EXISTING DB ---
      // 1. Check if "goals" table exists
      const goalsCheck = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='goals'`
      if ((goalsCheck as any[]).length === 0) {
        console.log('[DB] Applying migration: Creating goals table...')
        await prisma.$executeRawUnsafe(`
          CREATE TABLE "goals" (
              "id" TEXT NOT NULL PRIMARY KEY,
              "title" TEXT NOT NULL,
              "description" TEXT,
              "category" TEXT NOT NULL DEFAULT 'GENERAL',
              "targetDate" DATETIME NOT NULL,
              "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
              "completedAt" DATETIME,
              "notifiedAt" DATETIME,
              "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" DATETIME NOT NULL
          )
        `)
        await prisma.$executeRawUnsafe(`CREATE INDEX "goals_status_idx" ON "goals"("status")`)
        await prisma.$executeRawUnsafe(`CREATE INDEX "goals_targetDate_idx" ON "goals"("targetDate")`)
      }

      // 2. Check if pomodoroSessions column exists in tasks
      const tasksInfo = await prisma.$queryRawUnsafe(`PRAGMA table_info("tasks")`)
      const hasPomodoro = (tasksInfo as any[]).some((col: any) => col.name === 'pomodoroSessions')
      if (!hasPomodoro) {
        console.log('[DB] Applying migration: Adding pomodoroSessions to tasks...')
        await prisma.$executeRawUnsafe(`ALTER TABLE "tasks" ADD COLUMN "pomodoroSessions" INTEGER NOT NULL DEFAULT 0`)
      }
    }
    console.log('[DB] Database connected successfully')
  } catch (error) {
    console.error('[DB] Database connection failed:', error)
  }

  // Register all IPC handlers before creating window
  registerAllIpcHandlers()

  // Start background notifications
  notificationService.start()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setupApplicationMenu()
  createWindow()

  if (mainWindow) {
    trayService.init(mainWindow)
    quickAddService.register(mainWindow)
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      if (mainWindow) {
        trayService.init(mainWindow)
        quickAddService.register(mainWindow)
      }
    } else if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })
})

app.on('before-quit', async () => {
  await disconnectPrisma()
})

app.on('will-quit', () => {
  notificationService.stop()
  unregisterEmergencyShortcut()
  quickAddService.unregister()
  trayService.destroy()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
}
