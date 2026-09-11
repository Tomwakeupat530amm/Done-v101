// src/main/services/badge.service.ts
import { app, BrowserWindow } from 'electron'

export class BadgeService {
  /**
   * Cập nhật badge số trên biểu tượng Dock (macOS)
   */
  updateDockBadge(count: number): void {
    if (process.platform === 'darwin' && app.dock) {
      if (count > 0) {
        app.dock.setBadge(String(count))
      } else {
        app.dock.setBadge('')
      }
    }
  }

  /**
   * Cập nhật thanh tiến độ % trên thanh Taskbar (Windows)
   * progress: 0.0 -> 1.0 (hoặc -1 để tắt)
   */
  updateTaskbarProgress(progress: number, window?: BrowserWindow | null): void {
    if (!window || window.isDestroyed()) return
    try {
      window.setProgressBar(Math.max(-1, Math.min(1, progress)))
    } catch (_) {}
  }
}

export const badgeService = new BadgeService()
