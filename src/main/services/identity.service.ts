// src/main/services/identity.service.ts
import { prisma } from '../database/prisma.client'
import type { UpdateProfileDto, UpdateFutureSelfDto, CreateStatementDto as AddStatementDto } from '../../shared/dtos/identity.dto'
import { settingsService } from './settings.service'

export class IdentityService {
  private readonly DEFAULT_PROFILE_ID = 'default-profile'

  // Ensure a default profile exists (upsert avoids P2002 on parallel calls)
  private async ensureProfile() {
    const existing = await prisma.identityProfile.findUnique({
      where: { id: this.DEFAULT_PROFILE_ID }
    })
    if (existing) return existing

    const settings = await settingsService.getSettings()
    const isVi = settings.language === 'vi'

    return prisma.identityProfile.create({
      data: {
        id: this.DEFAULT_PROFILE_ID,
        displayName: 'Doer',
        identityStatement: isVi ? 'Tôi đang trở thành người kỷ luật và tự do.' : 'I am building a life I do not need to escape from.',
        coreValues: isVi ? JSON.stringify(['Kỷ luật', 'Tự do', 'Sức mạnh']) : JSON.stringify(['Discipline', 'Growth', 'Freedom']),
        statements: {
          createMany: {
            data: isVi ? [
              { text: 'Tôi là người có kỷ luật cao.', category: 'RECOVERY', displayOrder: 0 },
              { text: 'Tôi kiểm soát hành động của mình.', category: 'RECOVERY', displayOrder: 1 },
              { text: 'Mỗi ngày tôi đang trở nên tốt hơn.', category: 'GROWTH', displayOrder: 2 }
            ] : [
              { text: 'I am highly disciplined.', category: 'RECOVERY', displayOrder: 0 },
              { text: 'I control my actions.', category: 'RECOVERY', displayOrder: 1 },
              { text: 'Every day I am getting better.', category: 'GROWTH', displayOrder: 2 }
            ]
          }
        }
      }
    })
  }

  async getProfile() {
    return await this.ensureProfile()
  }

  async updateProfile(dto: UpdateProfileDto) {
    await this.ensureProfile()
    
    return prisma.identityProfile.update({
      where: { id: this.DEFAULT_PROFILE_ID },
      data: {
        ...(dto.displayName !== undefined && { displayName: dto.displayName }),
        ...(dto.identityStatement !== undefined && { identityStatement: dto.identityStatement }),
        ...(dto.coreValues !== undefined && { coreValues: JSON.stringify(dto.coreValues) }),
      }
    })
  }

  async getFutureSelf() {
    await this.ensureProfile()
    
    let futureSelf = await prisma.futureSelf.findFirst({
      where: { profileId: this.DEFAULT_PROFILE_ID },
      orderBy: { createdAt: 'desc' }
    })

    if (!futureSelf) {
      const settings = await settingsService.getSettings()
      const isVi = settings.language === 'vi'

      futureSelf = await prisma.futureSelf.create({
        data: {
          profileId: this.DEFAULT_PROFILE_ID,
          visionText: isVi 
            ? 'Tôi là người hoàn toàn tự do, sống đúng với giá trị của mình mỗi ngày.'
            : 'My future self is disciplined, present, and free from addiction.',
          keyTraits: isVi 
            ? JSON.stringify(['Kỷ luật', 'Tự tin', 'Tập trung']) 
            : JSON.stringify(['Present', 'Strong', 'Focused'])
        }
      })
    }
    return futureSelf
  }

  async updateFutureSelf(dto: UpdateFutureSelfDto) {
    const existing = await this.getFutureSelf()

    return prisma.futureSelf.update({
      where: { id: existing.id },
      data: {
        ...(dto.visionText !== undefined && { visionText: dto.visionText }),
        ...(dto.keyTraits !== undefined && { keyTraits: JSON.stringify(dto.keyTraits) }),
        ...(dto.targetDate !== undefined && { targetDate: dto.targetDate }),
        ...(dto.letterToSelf !== undefined && { letterToSelf: dto.letterToSelf })
      }
    })
  }

  async getStatements() {
    await this.ensureProfile()
    return prisma.identityStatement.findMany({
      where: { profileId: this.DEFAULT_PROFILE_ID },
      orderBy: { displayOrder: 'asc' }
    })
  }

  async addStatement(dto: AddStatementDto) {
    await this.ensureProfile()
    
    // Find highest order
    const maxOrder = await prisma.identityStatement.findFirst({
      where: { profileId: this.DEFAULT_PROFILE_ID },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true }
    })
    
    const nextOrder = (maxOrder?.displayOrder ?? 0) + 1

    return prisma.identityStatement.create({
      data: {
        profileId: this.DEFAULT_PROFILE_ID,
        text: dto.text,
        category: dto.category ?? 'RECOVERY',
        displayOrder: nextOrder,
        isActive: true
      }
    })
  }

  async removeStatement(id: string) {
    await prisma.identityStatement.delete({ where: { id } })
  }

  async reorderStatements(ids: string[]) {
    // Basic bulk update using transaction
    const updates = ids.map((id, index) => 
      prisma.identityStatement.update({
        where: { id },
        data: { displayOrder: index + 1 }
      })
    )
    await prisma.$transaction(updates)
  }
}

export const identityService = new IdentityService()
