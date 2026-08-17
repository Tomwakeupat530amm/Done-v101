import { PrismaClient } from '@prisma/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
});

async function test() {
  try {
    const dto = {
      name: 'Test',
      category: 'BODY',
      color: '#6366f1',
      icon: 'star',
      frequency: 'DAILY'
    };

    const nextSortOrder = await prisma.habit.count({
      where: { category: dto.category ?? 'BODY' }
    });

    const habit = await prisma.$transaction(async (tx) => {
      const h = await tx.habit.create({
        data: {
          name: dto.name,
          description: null,
          icon: dto.icon ?? 'check-circle',
          color: dto.color ?? '#6366f1',
          category: dto.category ?? 'BODY',
          type: 'BUILD',
          frequency: dto.frequency ?? 'DAILY',
          frequencyConfig: '{}',
          scheduledTime: null,
          cue: null,
          routine: null,
          reward: null,
          sortOrder: nextSortOrder
        }
      });

      await tx.habitStreak.create({
        data: {
          habitId: h.id,
          currentStreak: 0,
          longestStreak: 0,
          totalCompletions: 0
        }
      });

      return h;
    });

    console.log('Success:', habit);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
