// src/main/index.ts
// Atomic Recovery — Main Process Entry

import { app, shell, BrowserWindow } from 'electron'
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

// ping handler has been moved to registerAllIpcHandlers

// ─── App Lifecycle ─────────────────────────────────────────────

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
      const { join } = await import('path')
      const { app: electronApp } = await import('electron')
      const fs = await import('fs')
      const userDataPath = electronApp.getPath('userData')
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
