// src/main/services/habit.service.ts
// Atomic Recovery — HabitService

import { isYesterday, isToday, parseISO, startOfYear, endOfYear } from 'date-fns'
import { prisma } from '../database/prisma.client'
import type { CreateHabitDto, UpdateHabitDto } from '../../shared/types/ipc.types'

export class HabitService {
  // ─── Get all habits with their current streak ────────────────
  async getAllHabits() {
    return prisma.habit.findMany({
      where: { isArchived: false },
      include: {
        streak: true
      },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' }
      ]
    })
  }

  // ─── Get status of all habits for today ──────────────────────
  async getTodayStatus() {
    const todayStr = new Date().toISOString().split('T')[0]
    
    const habits = await prisma.habit.findMany({
      where: { isArchived: false },
      include: { streak: true }
    })
    
    const logs = await prisma.habitLog.findMany({
      where: {
        date: todayStr,
        habitId: { in: habits.map(h => h.id) }
      }
    })
    
    const logsMap = new Map(logs.map(l => [l.habitId, l]))
    
    return habits.map(habit => {
      const todayLog = logsMap.get(habit.id) || null
      return {
        habit,
        streak: habit.streak,
        todayLog,
        isCompletedToday: todayLog?.completed ?? false
      }
    })
  }

  // ─── Create a new habit ──────────────────────────────────────
  async createHabit(dto: CreateHabitDto) {
    const nextSortOrder = await prisma.habit.count({
      where: { category: dto.category ?? 'BODY' }
    })

    return prisma.$transaction(async (tx) => {
      const habit = await tx.habit.create({
        data: {
          name: dto.name,
          description: dto.description ?? null,
          icon: dto.icon ?? 'check-circle',
          color: dto.color ?? '#6366f1',
          category: dto.category ?? 'BODY',
          type: 'BUILD',
          frequency: dto.frequency ?? 'DAILY',
          frequencyConfig: '{}',
          scheduledTime: dto.scheduledTime ?? null,
          cue: dto.cue ?? null,
          routine: dto.routine ?? null,
          reward: dto.reward ?? null,
          sortOrder: nextSortOrder
        }
      })

      // Initialize empty streak record
      await tx.habitStreak.create({
        data: {
          habitId: habit.id,
          currentStreak: 0,
          longestStreak: 0,
          totalCompletions: 0
        }
      })

      return habit
    })
  }

  // ─── Update an existing habit ────────────────────────────────
  async updateHabit(id: string, dto: UpdateHabitDto) {
    return prisma.habit.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        category: dto.category,
        frequency: dto.frequency,
        scheduledTime: dto.scheduledTime,
        cue: dto.cue,
        routine: dto.routine,
        reward: dto.reward,
        isArchived: dto.isArchived,
        sortOrder: dto.sortOrder
      }
    })
  }

  // ─── Archive a habit ─────────────────────────────────────────
  async deleteHabit(id: string) {
    // We soft-delete by setting isArchived to true to preserve history
    return prisma.habit.update({
      where: { id },
      data: { isArchived: true }
    })
  }

  // ─── Check in a habit for a specific date ────────────────────
  async checkIn(habitId: string, date: string) {
    const parsedDate = parseISO(date)
    
    return prisma.$transaction(async (tx) => {
      // 1. Find or create the log for this date
      let log = await tx.habitLog.findUnique({
        where: { habitId_date: { habitId, date } }
      })

      let wasCompleted = false

      if (log) {
        // Toggle completion status
        wasCompleted = log.completed
        log = await tx.habitLog.update({
          where: { id: log.id },
          data: {
            completed: !wasCompleted,
            ...(!wasCompleted ? { completedAt: new Date() } : {})
          }
        })
      } else {
        log = await tx.habitLog.create({
          data: {
            habitId,
            date,
            completed: true,
            completedAt: new Date()
          }
        })
      }

      // 2. Update streak logic
      // Real app might recompute streaks fully if backdating, 
      // but for MVP we assume sequential check-ins or simple today/yesterday logic.
      
      let streak = await tx.habitStreak.findUnique({ where: { habitId } })
      if (!streak) {
        streak = await tx.habitStreak.create({
          data: { habitId, currentStreak: 0, longestStreak: 0, totalCompletions: 0 }
        })
      }

      // We only update currentStreak simply if the user is checking in today
      const isCheckInToday = isToday(parsedDate)
      
      let currentStreak = streak.currentStreak
      let totalCompletions = streak.totalCompletions
      let lastCompletedDate = streak.lastCompletedDate

      if (!wasCompleted) {
        // Turning ON
        totalCompletions += 1
        
        if (isCheckInToday) {
          lastCompletedDate = date
          if (streak.lastCompletedDate) {
            const lastDate = parseISO(streak.lastCompletedDate)
            if (isYesterday(lastDate)) {
              currentStreak += 1
            } else if (!isToday(lastDate)) {
              currentStreak = 1
            }
          } else {
            currentStreak = 1
          }
        }
      } else {
        // Turning OFF
        totalCompletions = Math.max(0, totalCompletions - 1)
        if (isCheckInToday) {
          // If we undo today's checkin, we should ideally revert currentStreak
          // For MVP, we decrement it.
          currentStreak = Math.max(0, currentStreak - 1)
          // Actually lastCompletedDate should revert to previous, but for MVP keeping it simple
        }
      }

      const longestStreak = Math.max(streak.longestStreak, currentStreak)

      return tx.habitStreak.update({
        where: { habitId },
        data: {
          currentStreak,
          longestStreak,
          totalCompletions,
          lastCompletedDate
        }
      })
    })
  }

  // ─── Get habit logs for a whole year (heatmap) ───────────────
  async getHabitLogs(habitId: string, year: number) {
    const start = startOfYear(new Date(year, 0, 1))
    const end = endOfYear(new Date(year, 0, 1))
    
    return prisma.habitLog.findMany({
      where: {
        habitId,
        date: {
          gte: start.toISOString().split('T')[0],
          lte: end.toISOString().split('T')[0]
        }
      },
      orderBy: { date: 'asc' }
    })
  }
}

export const habitService = new HabitService()
