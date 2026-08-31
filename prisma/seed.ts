// prisma/seed.ts
// Atomic Recovery — Database Seed Script
// Creates singleton rows required on first run

import { PrismaClient } from '@prisma/client'
import { join } from 'path'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${join(process.cwd(), 'prisma', 'dev.db')}`
    }
  }
})

async function main(): Promise<void> {
  console.log('🌱 Starting seed...')

  // ─── Settings Singleton ───────────────────────────────────────
  const settings = await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      theme: 'dark',
      accentColor: '#6366f1',
      language: 'vi',
      pinEnabled: false,
      biometricEnabled: false,
      notificationsOn: true,
      morningReminderAt: '07:00',
      eveningReminderAt: '21:00',
      emergencyButtonVisible: true,
      distractionList: JSON.stringify([
        'Uống một ly nước lạnh',
        'Đi bộ 10 phút',
        'Hít thở sâu 4-7-8',
        'Làm 20 cái hít đất',
        'Gọi cho một người bạn'
      ]),
      compactMode: false,
      onboardingCompleted: false,
      onboardingStep: 0,
      appVersion: '0.1.0'
    }
  })
  console.log('✅ Settings created:', settings.id)

  // ─── Identity Profile Default ─────────────────────────────────
  const existingProfiles = await prisma.identityProfile.count()

  if (existingProfiles === 0) {
    const isVi = Intl.DateTimeFormat().resolvedOptions().locale.startsWith('vi')

    const profile = await prisma.identityProfile.create({
      data: {
        displayName: isVi ? 'Người Phục Hồi' : 'Recovery Warrior',
        identityStatement: isVi ? 'Tôi đang trở thành người kỷ luật và tự do.' : 'I am building a life I do not need to escape from.',
        coreValues: isVi ? JSON.stringify(['Kỷ luật', 'Tự do', 'Sức mạnh']) : JSON.stringify(['Discipline', 'Growth', 'Freedom']),
        xpPoints: 0,
        level: 1,
        futureSelf: {
          create: {
            visionText: isVi 
              ? 'Tôi là người hoàn toàn tự do, sống đúng với giá trị của mình mỗi ngày.'
              : 'My future self is disciplined, present, and free from addiction.',
            keyTraits: isVi 
              ? JSON.stringify(['Kỷ luật', 'Tự tin', 'Tập trung']) 
              : JSON.stringify(['Present', 'Strong', 'Focused']),
            isActive: true
          }
        },
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
    console.log('✅ Identity profile created:', profile.id)
  } else {
    console.log('⏭️  Identity profile already exists, skipping.')
  }

  // ─── Default Recovery Session ─────────────────────────────────
  const activeSession = await prisma.recoverySession.findFirst({
    where: { isActive: true }
  })

  if (!activeSession) {
    const session = await prisma.recoverySession.create({
      data: {
        startedAt: new Date(),
        isActive: true,
        longestStreak: 0,
        totalDays: 0
      }
    })
    console.log('✅ Recovery session started:', session.id)
  } else {
    console.log('⏭️  Active recovery session already exists, skipping.')
  }

  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
