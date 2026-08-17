// src/main/services/mood.service.ts
import { prisma } from '../database/prisma.client'
import type { LogMoodDto } from '../../shared/dtos/mood.dto'

export class MoodService {
  async getMoodsByDate(date: string) {
    return prisma.moodLog.findMany({
      where: { date },
      orderBy: { loggedAt: 'asc' }
    })
  }

  async logMood(dto: LogMoodDto) {
    // Upsert mood per date and period (so if they log MORNING twice, it overrides)
    // We need to find if there is an existing one for that date and period
    const existing = await prisma.moodLog.findFirst({
      where: {
        date: dto.date,
        period: dto.period
      }
    })

    if (existing) {
      return prisma.moodLog.update({
        where: { id: existing.id },
        data: {
          mood: dto.mood,
          energy: dto.energy,
          note: dto.note
        }
      })
    } else {
      return prisma.moodLog.create({
        data: {
          date: dto.date,
          period: dto.period,
          mood: dto.mood,
          energy: dto.energy,
          note: dto.note,
          anxiety: 3,
          focus: 3,
          emotionTags: '[]'
        }
      })
    }
  }
}

export const moodService = new MoodService()
