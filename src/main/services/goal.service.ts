import { prisma } from '../database/prisma.client'
import type { CreateGoalDto, UpdateGoalDto } from '../../shared/types/goal.types'

export class GoalService {
  async getAll() {
    return prisma.goal.findMany({
      orderBy: [
        { status: 'asc' }, // IN_PROGRESS first alphabetically
        { targetDate: 'asc' }
      ]
    })
  }

  async getDueGoals() {
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    return prisma.goal.findMany({
      where: {
        status: { in: ['IN_PROGRESS', 'EXTENDED'] },
        targetDate: { lte: endOfToday }
      },
      orderBy: { targetDate: 'asc' }
    })
  }

  async create(data: CreateGoalDto) {
    return prisma.goal.create({
      data: {
        title: data.title,
        description: data.description || null,
        category: data.category || 'GENERAL',
        targetDate: new Date(data.targetDate),
        status: 'IN_PROGRESS'
      }
    })
  }

  async update(id: string, data: UpdateGoalDto) {
    return prisma.goal.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.targetDate !== undefined ? { targetDate: new Date(data.targetDate) } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.completedAt !== undefined ? { completedAt: data.completedAt ? new Date(data.completedAt) : null } : {}),
        ...(data.notifiedAt !== undefined ? { notifiedAt: data.notifiedAt ? new Date(data.notifiedAt) : null } : {})
      }
    })
  }

  async delete(id: string) {
    await prisma.goal.delete({
      where: { id }
    })
  }

  async markCompleted(id: string) {
    return prisma.goal.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
  }

  async extendTargetDate(id: string, newTargetDate: string) {
    return prisma.goal.update({
      where: { id },
      data: {
        targetDate: new Date(newTargetDate),
        status: 'EXTENDED',
        notifiedAt: null
      }
    })
  }

  async markNotified(id: string) {
    return prisma.goal.update({
      where: { id },
      data: {
        notifiedAt: new Date()
      }
    })
  }
}

export const goalService = new GoalService()
