// src/main/services/pin.service.ts
// Atomic Recovery — PIN lock service using bcryptjs (pure JS, no native)

import bcrypt from 'bcryptjs'
import { prisma } from '../database/prisma.client'

const SETTINGS_ID = 'singleton'
const SALT_ROUNDS = 10

export class PinService {
  async setPin(pin: string): Promise<void> {
    const hash = await bcrypt.hash(pin, SALT_ROUNDS)
    await prisma.settings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, pinEnabled: true, pinHash: hash },
      update: { pinEnabled: true, pinHash: hash }
    })
  }

  async verifyPin(pin: string): Promise<boolean> {
    const settings = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } })
    if (!settings?.pinHash) return true // No PIN set = always unlock
    return bcrypt.compare(pin, settings.pinHash)
  }

  async disablePin(): Promise<void> {
    await prisma.settings.update({
      where: { id: SETTINGS_ID },
      data: { pinEnabled: false, pinHash: null }
    })
  }

  async isPinEnabled(): Promise<boolean> {
    const settings = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } })
    return settings?.pinEnabled ?? false
  }
}

export const pinService = new PinService()
