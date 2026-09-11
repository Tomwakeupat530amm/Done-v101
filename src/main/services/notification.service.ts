// src/main/services/notification.service.ts
import { Notification } from 'electron'
import { prisma } from '../database/prisma.client'

export class NotificationService {
  private timer: NodeJS.Timeout | null = null
  private lastNotifiedMorningDate: string | null = null
  private lastNotifiedEveningDate: string | null = null

  start(): void {
    if (this.timer) return
    // Check every 30 seconds
    this.timer = setInterval(() => this.checkSchedule(), 30 * 1000)
    console.log('[NotificationService] Scheduled reminder timer started')
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
      console.log('[NotificationService] Stopped')
    }
  }

  async checkSchedule(): Promise<void> {
    try {
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
      if (!settings || !settings.notificationsOn) return

      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const todayStr = `${year}-${month}-${day}`
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const currentTime = `${hours}:${minutes}`

      const morningTarget = settings.morningReminderAt || '07:00'
      const eveningTarget = settings.eveningReminderAt || '21:00'

      if (currentTime === morningTarget && this.lastNotifiedMorningDate !== todayStr) {
        this.lastNotifiedMorningDate = todayStr
        this.showNotification(
          settings.language === 'en' ? 'Morning Check-in ☀️' : 'Check-in buổi sáng ☀️',
          settings.language === 'en'
            ? 'Start your day with clear intentions and log your status!'
            : 'Hãy khởi đầu ngày mới bằng cách đặt mục tiêu và ghi nhận trạng thái!'
        )
      }

      if (currentTime === eveningTarget && this.lastNotifiedEveningDate !== todayStr) {
        this.lastNotifiedEveningDate = todayStr
        this.showNotification(
          settings.language === 'en' ? 'Evening Reflection 🌙' : 'Nhìn lại cuối ngày 🌙',
          settings.language === 'en'
            ? 'Time for evening reflection. Celebrate today’s wins!'
            : 'Đã đến giờ phản chiếu cuối ngày. Xem lại các thành công hôm nay nhé!'
        )
      }
    } catch (err) {
      console.error('[NotificationService] Error in checkSchedule:', err)
    }
  }

  showNotification(title: string, body: string): void {
    if (!Notification.isSupported()) {
      console.warn('[NotificationService] Desktop notifications not supported on this platform')
      return
    }
    const notif = new Notification({
      title,
      body,
      silent: false
    })
    notif.show()
  }

  sendTestNotification(language = 'vi'): { success: boolean } {
    this.showNotification(
      'Done 🔔',
      language === 'en'
        ? 'System notifications are working! You will receive your daily reminders.'
        : 'Thông báo hệ thống hoạt động tốt! Bạn sẽ nhận được lời nhắc hàng ngày.'
    )
    return { success: true }
  }

  sendCustom(title: string, body: string): { success: boolean } {
    this.showNotification(title, body)
    return { success: true }
  }
}

export const notificationService = new NotificationService()
