import { prisma } from '../database/prisma.client'
import { app, dialog, BrowserWindow } from 'electron'
import fs from 'fs'

const SINGLETON_ID = 'singleton'

export class SettingsService {
  async getSettings() {
    const settings = await prisma.settings.findUnique({
      where: { id: SINGLETON_ID }
    })
    if (!settings) {
      // Determine default language
      let isVi = true
      try {
        isVi = app.getLocale().startsWith('vi')
      } catch (e) {
        // Fallback if not running in electron main
      }

      const distractionListVi = JSON.stringify([
        'Uống một ly nước lạnh',
        'Đi bộ 10 phút',
        'Hít thở sâu 4-7-8',
        'Làm 20 cái hít đất',
        'Gọi cho một người bạn'
      ])
      
      const distractionListEn = JSON.stringify([
        'Drink a glass of cold water',
        'Take a 10-minute walk',
        'Do 4-7-8 deep breathing',
        'Do 20 push-ups',
        'Call a friend'
      ])

      try {
        // Create default settings on first run if missing
        return await prisma.settings.upsert({
          where: { id: SINGLETON_ID },
          create: { 
            id: SINGLETON_ID,
            language: isVi ? 'vi' : 'en',
            distractionList: isVi ? distractionListVi : distractionListEn
          },
          update: {} // do nothing if exists
        })
      } catch (error: any) {
        throw error
      }
    }
    return settings
  }

  async updateSettings(data: Record<string, unknown>) {
    // Ensure singleton exists first
    await this.getSettings()

    // Filter only allowed keys (prevent unexpected fields crashing Prisma)
    const allowed = [
      'theme', 'accentColor', 'language', 'pinEnabled', 'pinHash',
      'notificationsOn', 'morningReminderAt', 'eveningReminderAt',
      'emergencyButtonVisible', 'compactMode', 'distractionList',
      'affirmationSchedule', 'highRiskTimes', 'onboardingCompleted',
      'onboardingStep', 'backupPath', 'lastBackupAt'
    ]
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => allowed.includes(k))
    )

    return prisma.settings.update({
      where: { id: SINGLETON_ID },
      data: filtered as Parameters<typeof prisma.settings.update>[0]['data']
    })
  }

  async exportBackup(window?: BrowserWindow | null): Promise<{ success: boolean; canceled?: boolean; filePath?: string; lastBackupAt?: string; error?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const defaultPath = `done-backup-${today}.json`

      const saveOptions = {
        title: 'Sao lưu dữ liệu Done',
        defaultPath,
        filters: [{ name: 'JSON files (*.json)', extensions: ['json'] }]
      }

      const { canceled, filePath } = window
        ? await dialog.showSaveDialog(window, saveOptions)
        : await dialog.showSaveDialog(saveOptions)

      if (canceled || !filePath) {
        return { success: false, canceled: true }
      }

      // Query all user data
      const [
        settings,
        habits,
        habitLogs,
        habitStreaks,
        dailyLogs,
        tasks,
        goals,
        urgeLogs,
        recoverySessions,
        relapseEvents,
        identityProfiles,
        futureSelves,
        identityStatements
      ] = await Promise.all([
        prisma.settings.findUnique({ where: { id: SINGLETON_ID } }),
        prisma.habit.findMany(),
        prisma.habitLog.findMany(),
        prisma.habitStreak.findMany(),
        prisma.dailyLog.findMany(),
        prisma.task.findMany(),
        prisma.goal.findMany(),
        prisma.urgeLog.findMany(),
        prisma.recoverySession.findMany(),
        prisma.relapseEvent.findMany(),
        prisma.identityProfile.findMany(),
        prisma.futureSelf.findMany(),
        prisma.identityStatement.findMany()
      ])

      const backupData = {
        app: 'Done',
        version: '0.1.0',
        exportedAt: new Date().toISOString(),
        tables: {
          settings,
          habits,
          habitLogs,
          habitStreaks,
          dailyLogs,
          tasks,
          goals,
          urgeLogs,
          recoverySessions,
          relapseEvents,
          identityProfiles,
          futureSelves,
          identityStatements
        }
      }

      await fs.promises.writeFile(filePath, JSON.stringify(backupData, null, 2), 'utf-8')

      const now = new Date()
      await prisma.settings.update({
        where: { id: SINGLETON_ID },
        data: { lastBackupAt: now.toISOString(), backupPath: filePath }
      })

      return {
        success: true,
        filePath,
        lastBackupAt: now.toISOString()
      }
    } catch (error: any) {
      console.error('[SettingsService] Failed to export backup:', error)
      return { success: false, error: error.message }
    }
  }

  async importBackup(window?: BrowserWindow | null): Promise<{ success: boolean; canceled?: boolean; error?: string }> {
    try {
      const openOptions = {
        title: 'Nhập sao lưu dữ liệu Done',
        filters: [{ name: 'JSON files (*.json)', extensions: ['json'] }],
        properties: ['openFile' as const]
      }

      const { canceled, filePaths } = window
        ? await dialog.showOpenDialog(window, openOptions)
        : await dialog.showOpenDialog(openOptions)

      if (canceled || !filePaths || filePaths.length === 0) {
        return { success: false, canceled: true }
      }

      const filePath = filePaths[0]
      const fileContent = await fs.promises.readFile(filePath, 'utf-8')
      const backup = JSON.parse(fileContent)

      if (!backup || !backup.tables) {
        return { success: false, error: 'Tệp sao lưu không đúng định dạng.' }
      }

      const { tables } = backup

      // Transactional restore
      await prisma.$transaction(async (tx) => {
        // Habits & logs & streaks
        if (Array.isArray(tables.habitLogs)) {
          await tx.habitLog.deleteMany()
        }
        if (Array.isArray(tables.habitStreaks)) {
          await tx.habitStreak.deleteMany()
        }
        if (Array.isArray(tables.habits)) {
          await tx.habit.deleteMany()
          for (const item of tables.habits) {
            await tx.habit.create({ data: item })
          }
        }
        if (Array.isArray(tables.habitLogs)) {
          for (const item of tables.habitLogs) {
            await tx.habitLog.create({ data: item })
          }
        }
        if (Array.isArray(tables.habitStreaks)) {
          for (const item of tables.habitStreaks) {
            await tx.habitStreak.create({ data: item })
          }
        }

        // Tasks
        if (Array.isArray(tables.tasks)) {
          await tx.task.deleteMany()
          for (const item of tables.tasks) {
            await tx.task.create({ data: item })
          }
        }

        // Goals
        if (Array.isArray(tables.goals)) {
          await tx.goal.deleteMany()
          for (const item of tables.goals) {
            await tx.goal.create({ data: item })
          }
        }

        // Daily Logs
        if (Array.isArray(tables.dailyLogs)) {
          await tx.dailyLog.deleteMany()
          for (const item of tables.dailyLogs) {
            await tx.dailyLog.create({ data: item })
          }
        }

        // Recovery
        if (Array.isArray(tables.relapseEvents)) {
          await tx.relapseEvent.deleteMany()
        }
        if (Array.isArray(tables.recoverySessions)) {
          await tx.recoverySession.deleteMany()
          for (const item of tables.recoverySessions) {
            await tx.recoverySession.create({ data: item })
          }
        }
        if (Array.isArray(tables.relapseEvents)) {
          for (const item of tables.relapseEvents) {
            await tx.relapseEvent.create({ data: item })
          }
        }
        if (Array.isArray(tables.urgeLogs)) {
          await tx.urgeLog.deleteMany()
          for (const item of tables.urgeLogs) {
            await tx.urgeLog.create({ data: item })
          }
        }

        // Identity
        if (Array.isArray(tables.futureSelves)) {
          await tx.futureSelf.deleteMany()
        }
        if (Array.isArray(tables.identityStatements)) {
          await tx.identityStatement.deleteMany()
        }
        if (Array.isArray(tables.identityProfiles)) {
          await tx.identityProfile.deleteMany()
          for (const item of tables.identityProfiles) {
            await tx.identityProfile.create({ data: item })
          }
        }
        if (Array.isArray(tables.futureSelves)) {
          for (const item of tables.futureSelves) {
            await tx.futureSelf.create({ data: item })
          }
        }
        if (Array.isArray(tables.identityStatements)) {
          for (const item of tables.identityStatements) {
            await tx.identityStatement.create({ data: item })
          }
        }

        // Settings (update current singleton)
        if (tables.settings) {
          const { id, ...settingsData } = tables.settings
          await tx.settings.update({
            where: { id: SINGLETON_ID },
            data: settingsData
          })
        }
      })

      return { success: true }
    } catch (error: any) {
      console.error('[SettingsService] Failed to import backup:', error)
      return { success: false, error: error.message }
    }
  }
}

export const settingsService = new SettingsService()
