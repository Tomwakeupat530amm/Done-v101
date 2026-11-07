import { prisma } from '../database/prisma.client'
import type { CreateTaskDto, UpdateTaskDto, TaskStatus } from '../../shared/types/task.types'

export class TaskService {
  async getAll() {
    // Chỉ fetch các task DONE trong vòng 7 ngày gần nhất để tránh lag (cột DONE phình to)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.task.findMany({
      where: {
        OR: [
          { status: { not: 'DONE' } },
          { 
            status: 'DONE',
            completedAt: { gte: sevenDaysAgo }
          }
        ]
      },
      orderBy: { order: 'asc' }
    });
  }

  async getDashboardTasks() {
    return prisma.task.findMany({
      where: {
        OR: [
          { status: 'IN_PROGRESS' },
          { status: 'TODO', priority: 'HIGH' }
        ]
      },
      orderBy: { order: 'asc' },
      take: 5
    });
  }

  // Tasks for the floating widget: overdue (created before today, not done) + today's open tasks
  async getWidgetTasks() {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [open, doneToday] = await Promise.all([
      prisma.task.findMany({
        where: { status: { in: ['TODO', 'IN_PROGRESS'] } },
        orderBy: { order: 'asc' }
      }),
      prisma.task.count({
        where: { status: 'DONE', completedAt: { gte: startOfToday } }
      })
    ])

    const weight: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }
    const sorted = [...open].sort(
      (a, b) => (weight[a.priority] ?? 1) - (weight[b.priority] ?? 1) || a.order - b.order
    )

    return {
      overdue: sorted.filter((t) => t.createdAt < startOfToday),
      today: sorted.filter((t) => t.createdAt >= startOfToday),
      doneToday
    }
  }

  async create(data: CreateTaskDto) {
    const isDone = data.status === 'DONE';
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        order: data.order || Date.now(),
        completedAt: isDone ? new Date() : null
      }
    });
  }

  async update(id: string, data: UpdateTaskDto) {
    let completedAtUpdate: Date | null | undefined = undefined;
    if (data.status) {
      completedAtUpdate = data.status === 'DONE' ? new Date() : null;
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(completedAtUpdate !== undefined ? { completedAt: completedAtUpdate } : {})
      }
    });
  }

  async delete(id: string) {
    await prisma.task.delete({
      where: { id }
    });
  }

  async updateOrder(id: string, newStatus: TaskStatus, newOrder: number) {
    return prisma.task.update({
      where: { id },
      data: {
        status: newStatus,
        order: newOrder,
        completedAt: newStatus === 'DONE' ? new Date() : null
      }
    });
  }

  async incrementPomodoro(id: string) {
    return prisma.task.update({
      where: { id },
      data: {
        pomodoroSessions: { increment: 1 }
      }
    });
  }

  async getCompletedTasksByDate(dateStr: string) {
    const startOfDay = new Date(`${dateStr}T00:00:00.000`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999`);
    return prisma.task.findMany({
      where: {
        status: 'DONE',
        completedAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: { completedAt: 'desc' }
    });
  }
}

export const taskService = new TaskService();

