// src/main/ipc/recovery.handler.ts
// Atomic Recovery — Recovery IPC Handler Registration

import { ipcMain } from 'electron'
import { recoveryService } from '../services/recovery.service'
import type { LogRelapseDto } from '../../shared/types/ipc.types'
import type { LogUrgeDto } from '../../shared/dtos/emergency.dto'

export function registerRecoveryHandlers(): void {
  // ─── Get streak display ──────────────────────────────────────
  ipcMain.handle('recovery:getStreakDisplay', async () => {
    return recoveryService.getStreakDisplay()
  })

  // ─── Get active session ──────────────────────────────────────
  ipcMain.handle('recovery:getActiveSession', async () => {
    return recoveryService.getActiveSession()
  })

  // ─── Log relapse ─────────────────────────────────────────────
  ipcMain.handle('recovery:logRelapse', async (_event, dto: LogRelapseDto) => {
    await recoveryService.logRelapse(dto)
    // Auto-check milestones on new session (0 days)
    return null
  })

  // ─── Log urge ────────────────────────────────────────────────
  ipcMain.handle('recovery:logUrge', async (_event, dto: LogUrgeDto) => {
    return recoveryService.logUrge(dto)
  })

  // ─── Get relapse history ─────────────────────────────────────
  ipcMain.handle('recovery:getRelapseHistory', async (_event, { limit }: { limit?: number }) => {
    return recoveryService.getRelapseHistory(limit)
  })

  // ─── Get all milestones ──────────────────────────────────────
  ipcMain.handle('recovery:getMilestones', async () => {
    return recoveryService.getMilestones()
  })

  // ─── Get urge stats ──────────────────────────────────────────
  ipcMain.handle('recovery:getUrgeStats', async () => {
    return recoveryService.getUrgeStats()
  })

  // ─── Check milestones (called after counter refresh) ─────────
  ipcMain.handle('recovery:checkMilestones', async (_event, { days }: { days: number }) => {
    return recoveryService.checkMilestones(days)
  })

  console.log('[IPC] Recovery handlers registered')
}
