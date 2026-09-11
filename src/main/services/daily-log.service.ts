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

  async getDailySummary(dateStr: string) {
    const startOfDay = new Date(`${dateStr}T00:00:00.000`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999`);

    const [log, completedTasks, completedHabitsLogs] = await Promise.all([
      prisma.dailyLog.findUnique({ where: { date: dateStr } }),
      prisma.task.findMany({
        where: {
          status: 'DONE',
          completedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        orderBy: { completedAt: 'desc' }
      }),
      prisma.habitLog.findMany({
        where: {
          date: dateStr,
          completed: true
        },
        include: {
          habit: {
            include: { streak: true }
          }
        },
        orderBy: { completedAt: 'asc' }
      })
    ]);

    const completedHabits = completedHabitsLogs.map((hl) => ({
      id: hl.habit.id,
      name: hl.habit.name,
      icon: hl.habit.icon,
      color: hl.habit.color,
      streak: hl.habit.streak?.currentStreak || 0,
      targetCount: hl.habit.targetCount,
      countValue: hl.countValue,
      targetMinutes: hl.habit.targetMinutes,
      durationValue: hl.durationValue
    }));

    return {
      date: dateStr,
      log: this.mapLog(log),
      completedTasks,
      completedHabits
    };
  }

  async getAllFeed() {
    const logs = await prisma.dailyLog.findMany({ orderBy: { date: 'desc' } });
    const logsMap = new Map(logs.map((l) => [l.date, this.mapLog(l)]));

    const allDoneTasks = await prisma.task.findMany({
      where: {
        status: 'DONE',
        completedAt: { not: null }
      },
      orderBy: { completedAt: 'desc' }
    });

    const tasksByDate = new Map<string, typeof allDoneTasks>();
    for (const t of allDoneTasks) {
      if (!t.completedAt) continue;
      const d = new Date(t.completedAt);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${day}`;
      if (!tasksByDate.has(dateKey)) {
        tasksByDate.set(dateKey, []);
      }
      tasksByDate.get(dateKey)!.push(t);
    }

    const allHabitLogs = await prisma.habitLog.findMany({
      where: { completed: true },
      include: {
        habit: {
          include: { streak: true }
        }
      },
      orderBy: { completedAt: 'asc' }
    });

    const habitsByDate = new Map<string, any[]>();
    for (const hl of allHabitLogs) {
      if (!habitsByDate.has(hl.date)) {
        habitsByDate.set(hl.date, []);
      }
      habitsByDate.get(hl.date)!.push({
        id: hl.habit.id,
        name: hl.habit.name,
        icon: hl.habit.icon,
        color: hl.habit.color,
        streak: hl.habit.streak?.currentStreak || 0,
        targetCount: hl.habit.targetCount,
        countValue: hl.countValue,
        targetMinutes: hl.habit.targetMinutes,
        durationValue: hl.durationValue
      });
    }

    const allDatesSet = new Set<string>([
      ...logsMap.keys(),
      ...tasksByDate.keys(),
      ...habitsByDate.keys()
    ]);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    allDatesSet.add(todayStr);

    const sortedDates = Array.from(allDatesSet).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((dateStr) => ({
      date: dateStr,
      log: logsMap.get(dateStr) || null,
      completedTasks: tasksByDate.get(dateStr) || [],
      completedHabits: habitsByDate.get(dateStr) || []
    }));
  }

  async saveMorning(date: string, morningIntention: string) {
    const log = await prisma.dailyLog.upsert({
      where: { date },
      create: {
        date,
        morningIntention
      },
      update: {
        morningIntention
      }
    });
    return this.mapLog(log);
  }

  async saveEvening(date: string, reflection: string) {
    const log = await prisma.dailyLog.upsert({
      where: { date },
      create: {
        date,
        reflection
      },
      update: {
        reflection
      }
    });
    return this.mapLog(log);
  }

  async create(data: CreateDailyLogDto) {
    const emotionTagsStr = data.emotionTags ? JSON.stringify(data.emotionTags) : undefined;
    const gratitudeStr = data.gratitude ? JSON.stringify(data.gratitude) : undefined;

    const log = await prisma.dailyLog.upsert({
      where: { date: data.date },
      create: {
        date: data.date,
        mood: data.mood,
        energy: data.energy,
        emotionTags: emotionTagsStr || '[]',
        morningIntention: data.morningIntention,
        gratitude: gratitudeStr || '[]',
        reflection: data.reflection
      },
      update: {
        ...(data.mood !== undefined && { mood: data.mood }),
        ...(data.energy !== undefined && { energy: data.energy }),
        ...(emotionTagsStr !== undefined && { emotionTags: emotionTagsStr }),
        ...(data.morningIntention !== undefined && { morningIntention: data.morningIntention }),
        ...(gratitudeStr !== undefined && { gratitude: gratitudeStr }),
        ...(data.reflection !== undefined && { reflection: data.reflection })
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
