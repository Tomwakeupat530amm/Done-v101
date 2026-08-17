import { prisma } from '../database/prisma.client'
import { app } from 'electron'

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

      // Create default settings on first run
      return prisma.settings.create({
        data: { 
          id: SINGLETON_ID,
          language: isVi ? 'vi' : 'en',
          distractionList: isVi ? distractionListVi : distractionListEn
        }
      })
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
}

export const settingsService = new SettingsService()
