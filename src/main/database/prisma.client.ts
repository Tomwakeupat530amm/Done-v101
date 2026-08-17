// src/main/database/prisma.client.ts
// PrismaClient singleton with correct path for dev and production

import { PrismaClient } from '@prisma/client'
import { join } from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

function getDatabaseUrl(): string {
  if (is.dev) {
    // In development, use the local dev.db in project root
    return `file:${join(process.cwd(), 'prisma', 'dev.db')}`
  }
  // In production, use the user data directory
  const userDataPath = app.getPath('userData')
  return `file:${join(userDataPath, 'atomic-recovery.db')}`
}

// Singleton instance
let _prisma: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!_prisma) {
    const databaseUrl = getDatabaseUrl()
    
    // Explicitly configure engine path for production
    const enginePath = is.dev 
      ? join(process.cwd(), 'node_modules', '.prisma', 'client', 'query_engine-windows.dll.node')
      : join(process.resourcesPath, 'node_modules', '.prisma', 'client', 'query_engine-windows.dll.node')
      
    if (!is.dev) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath
    }

    _prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    })
    console.log('[Prisma] Connected to database:', databaseUrl)
  }
  return _prisma
}

export async function disconnectPrisma(): Promise<void> {
  if (_prisma) {
    await _prisma.$disconnect()
    _prisma = null
    console.log('[Prisma] Disconnected')
  }
}

// Export singleton for convenience
export const prisma = getPrismaClient()
