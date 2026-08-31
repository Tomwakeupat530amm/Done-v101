import { prisma } from '../database/prisma.client';
import { CreateDailyLogDto, UpdateDailyLogDto } from '../../shared/dtos/daily-log.dto';

export class DailyLogService {
  private mapLog(log: any) {
    if (!log) return null;
    return {
      ...log,
      emotionTags: log.emotionTags ? JSON.parse(log.emotionTags) : [],
      gratitude: log.gratitude ? JSON.parse(log.gratitude) : []
    };
  }

  async getByDate(date: string) {
    const log = await prisma.dailyLog.findUnique({ where: { date } });
    return this.mapLog(log);
  }

  async getAll() {
    const logs = await prisma.dailyLog.findMany({ orderBy: { date: 'desc' } });
    return logs.map(this.mapLog);
  }

  async create(data: CreateDailyLogDto) {
    const log = await prisma.dailyLog.create({
      data: {
        date: data.date,
        mood: data.mood,
        energy: data.energy,
        emotionTags: data.emotionTags ? JSON.stringify(data.emotionTags) : '[]',
        morningIntention: data.morningIntention,
        gratitude: data.gratitude ? JSON.stringify(data.gratitude) : '[]',
        reflection: data.reflection
      }
    });
    return this.mapLog(log);
  }

  async update(id: string, data: UpdateDailyLogDto) {
    const updateData: any = { ...data };
    if (data.emotionTags !== undefined) {
      updateData.emotionTags = JSON.stringify(data.emotionTags);
    }
    if (data.gratitude !== undefined) {
      updateData.gratitude = JSON.stringify(data.gratitude);
    }
    
    const log = await prisma.dailyLog.update({
      where: { id },
      data: updateData
    });
    return this.mapLog(log);
  }
}

export const dailyLogService = new DailyLogService();
