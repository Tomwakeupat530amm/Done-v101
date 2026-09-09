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
}

export const taskService = new TaskService();

