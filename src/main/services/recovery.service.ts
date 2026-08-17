// src/main/services/recovery.service.ts
// Atomic Recovery — RecoveryService
// Handles sobriety counter, relapse events, milestones, urge tracking

import { differenceInDays, differenceInSeconds } from 'date-fns'
import { prisma } from '../database/prisma.client'
import type { LogRelapseDto } from '../../shared/types/ipc.types'
import type { LogUrgeDto } from '../../shared/dtos/emergency.dto'

// Milestone thresholds in days
const MILESTONE_THRESHOLDS = [1, 3, 7, 14, 30, 60, 90, 180, 365]

const MILESTONE_NAMES: Record<number, string> = {
  1: 'Ngày Đầu Tiên',
  3: 'Ba Ngày Kiên Định',
  7: 'Một Tuần Bản Lĩnh',
  14: 'Hai Tuần Vững Chắc',
  30: 'Một Tháng Chiến Thắng',
  60: 'Hai Tháng Tự Do',
  90: 'Ba Tháng — Thói Quen Mới',
  180: 'Sáu Tháng — Cuộc Sống Mới',
  365: 'Một Năm — Người Mới'
}

export class RecoveryService {
  // ─── Get active session ────────────────────────────────────────
  async getActiveSession() {
    return prisma.recoverySession.findFirst({
      where: { isActive: true },
      include: { relapses: { orderBy: { occurredAt: 'desc' }, take: 5 } }
    })
  }

  // ─── Get streak in days (fractional for hours) ────────────────
  async getStreakDays(): Promise<number> {
    const session = await this.getActiveSession()
    if (!session) return 0
    const seconds = differenceInSeconds(new Date(), session.startedAt)
    return seconds / 86400 // fractional days
  }

  // ─── Get formatted streak display ─────────────────────────────
  async getStreakDisplay(): Promise<{ days: number; hours: number; minutes: number; totalSeconds: number }> {
    const session = await this.getActiveSession()
    if (!session) {
      return { days: 0, hours: 0, minutes: 0, totalSeconds: 0 }
    }
    const totalSeconds = differenceInSeconds(new Date(), session.startedAt)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    return { days, hours, minutes, totalSeconds }
  }

  // ─── Start new recovery session ───────────────────────────────
  async startNewSession() {
    return prisma.recoverySession.create({
      data: {
        startedAt: new Date(),
        isActive: true,
        longestStreak: 0,
        totalDays: 0
      }
    })
  }

  // ─── Log relapse: close current session, create event, start new ─
  async logRelapse(dto: LogRelapseDto): Promise<void> {
    const session = await this.getActiveSession()

    await prisma.$transaction(async (tx) => {
      if (session) {
        // Calculate streak length
        const streakDays = differenceInDays(new Date(), session.startedAt)

        // Close current session
        await tx.recoverySession.update({
          where: { id: session.id },
          data: {
            isActive: false,
            endedAt: new Date(),
            totalDays: streakDays,
            longestStreak: Math.max(session.longestStreak, streakDays)
          }
        })

        // Log relapse event
        await tx.relapseEvent.create({
          data: {
            sessionId: session.id,
            occurredAt: new Date(),
            triggerType: dto.triggerType ?? null,
            triggerNote: dto.triggerNote ?? null,
            urgeIntensity: dto.urgeIntensity ?? null,
            context: dto.context ?? null,
            location: dto.location ?? null,
            priorActivity: dto.priorActivity ?? null,
            emotionalState: dto.emotionalState ?? null,
            recoveryNote: dto.recoveryNote ?? null,
            wasEmergencyUsed: dto.wasEmergencyUsed ?? false
          }
        })
      }

      // Start new session immediately
      await tx.recoverySession.create({
        data: {
          startedAt: new Date(),
          isActive: true,
          longestStreak: 0,
          totalDays: 0
        }
      })
    })
  }

  // ─── Check and award milestones ───────────────────────────────
  async checkMilestones(days: number): Promise<{ days: number; name: string; xpAwarded: number } | null> {
    for (const threshold of MILESTONE_THRESHOLDS) {
      if (days >= threshold) {
        // Check if already awarded
        const existing = await prisma.milestone.findFirst({
          where: { days: threshold, type: 'RECOVERY' }
        })
        if (!existing) {
          const xp = threshold * 10
          await prisma.milestone.create({
            data: {
              days: threshold,
              type: 'RECOVERY',
              achievedAt: new Date(),
              xpAwarded: xp,
              celebrated: false
            }
          })
          return { days: threshold, name: MILESTONE_NAMES[threshold] ?? `${threshold} Days`, xpAwarded: xp }
        }
      }
    }
    return null
  }

  // ─── Get relapse history ──────────────────────────────────────
  async getRelapseHistory(limit = 10) {
    return prisma.relapseEvent.findMany({
      orderBy: { occurredAt: 'desc' },
      take: limit
    })
  }

  // ─── Log urge ─────────────────────────────────────────────────
  async logUrge(dto: LogUrgeDto) {
    return prisma.urgeLog.create({
      data: {
        loggedAt: new Date(),
        intensity: dto.intensity,
        triggerType: dto.triggerType ?? null,
        contextNote: dto.contextNote ?? null,
        outcome: dto.outcome,
        strategyUsed: dto.strategyUsed ?? null,
        emergencyUsed: dto.emergencyUsed ?? false,
        timerMinutes: dto.timerMinutes ?? null,
        durationMinutes: dto.durationMinutes ?? null
      }
    })
  }

  // ─── Get urge statistics ──────────────────────────────────────
  async getUrgeStats() {
    const [total, resisted, relapsed] = await Promise.all([
      prisma.urgeLog.count(),
      prisma.urgeLog.count({ where: { outcome: 'RESISTED' } }),
      prisma.urgeLog.count({ where: { outcome: 'RELAPSED' } })
    ])
    return {
      totalUrges: total,
      resisted,
      relapsed,
      resistanceRate: total > 0 ? Math.round((resisted / total) * 100) : 0
    }
  }

  // ─── Get all milestones ───────────────────────────────────────
  async getMilestones() {
    return prisma.milestone.findMany({
      where: { type: 'RECOVERY' },
      orderBy: { days: 'asc' }
    })
  }

  // ─── Get uncelebrated milestones ──────────────────────────────
  async getUncelebratedMilestones() {
    return prisma.milestone.findMany({
      where: { celebrated: false, type: 'RECOVERY' }
    })
  }

  // ─── Mark milestone as celebrated ────────────────────────────
  async markCelebrated(milestoneId: string) {
    return prisma.milestone.update({
      where: { id: milestoneId },
      data: { celebrated: true }
    })
  }

  // ─── Next milestone info ─────────────────────────────────────
  getNextMilestone(currentDays: number): { days: number; name: string; daysLeft: number } | null {
    const next = MILESTONE_THRESHOLDS.find((t) => t > currentDays)
    if (!next) return null
    return {
      days: next,
      name: MILESTONE_NAMES[next] ?? `${next} Days`,
      daysLeft: next - currentDays
    }
  }
}

// Singleton
export const recoveryService = new RecoveryService()
