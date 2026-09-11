// src/main/services/analytics.service.ts
// Atomic Recovery — Analytics & Reporting Service

import { prisma } from '../database/prisma.client'
import { subDays, format, startOfWeek, eachDayOfInterval } from 'date-fns'

export class AnalyticsService {
  // ─── 7-day mood trend ─────────────────────────────────────────
  async getMoodTrend(days = 7) {
    const today = new Date()
    const dates = Array.from({ length: days }, (_, i) =>
      format(subDays(today, days - 1 - i), 'yyyy-MM-dd')
    )

    const logs = await prisma.dailyLog.findMany({
      where: { date: { in: dates } },
      orderBy: { date: 'asc' }
    })

    return dates.map(date => {
      const dayLogs = logs.filter(l => l.date === date && l.mood !== null)
      const avgMood = dayLogs.length
        ? Math.round((dayLogs.reduce((s, l) => s + (l.mood as number), 0) / dayLogs.length) * 10) / 10
        : null
      const energyLogs = logs.filter(l => l.date === date && l.energy !== null)
      const avgEnergy = energyLogs.length
        ? Math.round((energyLogs.reduce((s, l) => s + (l.energy as number), 0) / energyLogs.length) * 10) / 10
        : null
      return { date, avgMood, avgEnergy, count: dayLogs.length }
    })
  }

  // ─── Habit completion rate per week ───────────────────────────
  async getHabitWeekStats() {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
    const days = eachDayOfInterval({ start: weekStart, end: today })
    const dateStrings = days.map(d => format(d, 'yyyy-MM-dd'))

    const [habits, logs] = await Promise.all([
      prisma.habit.findMany({ where: { isArchived: false } }),
      prisma.habitLog.findMany({
        where: { date: { in: dateStrings }, completed: true }
      })
    ])

    const totalPossible = habits.length * dateStrings.length
    const totalCompleted = logs.length
    const completionRate = totalPossible > 0
      ? Math.round((totalCompleted / totalPossible) * 100)
      : 0

    // Per-day breakdown
    const byDay = dateStrings.map(date => ({
      date,
      completed: logs.filter(l => l.date === date).length,
      total: habits.length
    }))

    return { completionRate, totalCompleted, totalPossible, byDay, habitCount: habits.length }
  }

  // ─── Task completion & Pomodoro stats for 7 days ───────────────
  async getTaskWeekStats(days = 7) {
    const today = new Date()
    const dates = Array.from({ length: days }, (_, i) =>
      format(subDays(today, days - 1 - i), 'yyyy-MM-dd')
    )
    const startDate = new Date(`${dates[0]}T00:00:00.000`)

    const tasks = await prisma.task.findMany({
      where: {
        status: 'DONE',
        completedAt: { gte: startDate }
      },
      select: {
        completedAt: true,
        pomodoroSessions: true
      }
    })

    const byDayMap = new Map<string, { completedTasks: number; pomodoroCount: number }>()
    for (const d of dates) {
      byDayMap.set(d, { completedTasks: 0, pomodoroCount: 0 })
    }

    let totalCompleted = 0
    let totalPomodoro = 0

    for (const t of tasks) {
      if (!t.completedAt) continue
      const dateKey = format(t.completedAt, 'yyyy-MM-dd')
      if (byDayMap.has(dateKey)) {
        const item = byDayMap.get(dateKey)!
        item.completedTasks += 1
        item.pomodoroCount += t.pomodoroSessions || 0
        totalCompleted += 1
        totalPomodoro += t.pomodoroSessions || 0
      }
    }

    const byDay = dates.map(date => ({
      date,
      completedTasks: byDayMap.get(date)!.completedTasks,
      pomodoroCount: byDayMap.get(date)!.pomodoroCount
    }))

    return {
      totalCompleted,
      totalPomodoro,
      byDay
    }
  }

  // ─── Recovery summary ──────────────────────────────────────────
  async getRecoverySummary() {
    const [activeSession, milestones, urgeStats, relapseCount] = await Promise.all([
      prisma.recoverySession.findFirst({ where: { isActive: true } }),
      prisma.milestone.findMany({ where: { type: 'RECOVERY' }, orderBy: { days: 'asc' } }),
      this.getUrgeStats(),
      prisma.relapseEvent.count()
    ])

    const longestSession = await prisma.recoverySession.findFirst({
      where: { isActive: false },
      orderBy: { totalDays: 'desc' }
    })

    return {
      isActive: !!activeSession,
      startedAt: activeSession?.startedAt ?? null,
      milestonesEarned: milestones.length,
      nextMilestone: this.getNextMilestone(milestones.map(m => m.days)),
      longestStreak: longestSession?.totalDays ?? 0,
      totalRelapses: relapseCount,
      urgeStats
    }
  }

  // ─── Urge stats ────────────────────────────────────────────────
  async getUrgeStats() {
    const [total, resisted] = await Promise.all([
      prisma.urgeLog.count(),
      prisma.urgeLog.count({ where: { outcome: 'RESISTED' } })
    ])
    return {
      total,
      resisted,
      relapsed: total - resisted,
      resistanceRate: total > 0 ? Math.round((resisted / total) * 100) : 0
    }
  }

  // ─── Journal streak ────────────────────────────────────────────
  async getJournalStreak() {
    const entries = await prisma.dailyLog.findMany({
      orderBy: { date: 'desc' },
      take: 30,
      select: { date: true }
    })
    const dates = entries.map(e => e.date)
    let streak = 0
    const today = format(new Date(), 'yyyy-MM-dd')
    let checking = today

    while (dates.includes(checking)) {
      streak++
      checking = format(subDays(new Date(checking), 1), 'yyyy-MM-dd')
    }

    return { streak, totalEntries: await prisma.dailyLog.count() }
  }

  private getNextMilestone(earnedDays: number[]): number | null {
    const thresholds = [1, 3, 7, 14, 30, 60, 90, 180, 365]
    const maxEarned = Math.max(...earnedDays, 0)
    return thresholds.find(t => t > maxEarned) ?? null
  }
}

export const analyticsService = new AnalyticsService()
