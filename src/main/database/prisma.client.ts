// src/main/database/prisma.client.ts
// PrismaClient singleton with correct path for dev and production

import { PrismaClient } from '@prisma/client'
import { join } from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import * as fs from 'fs'

function copyTemplateDb(dbPath: string): boolean {
  const templatePath = join(process.resourcesPath, 'prod.db')
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, dbPath)
    console.log('[Prisma] Database template copied to userData:', dbPath)
    return true
  }
  console.error('[Prisma] ERROR: Database template not found at', templatePath)
  return false
}

function getDatabaseUrl(): string {
  if (is.dev) {
    // In development, use the local dev.db in project root
    return `file:${join(process.cwd(), 'prisma', 'dev.db')}`
  }

  // In production, use the user data directory
  const userDataPath = app.getPath('userData')
  const dbPath = join(userDataPath, 'atomic-recovery.db')

  if (!fs.existsSync(dbPath)) {
    // DB file doesn't exist at all → copy fresh template
    copyTemplateDb(dbPath)
  } else {
    const stat = fs.statSync(dbPath)
    if (stat.size === 0) {
      // DB file exists but is empty (0 bytes) — left by a failed previous install
      // Delete it and copy the template
      console.warn('[Prisma] Found empty database file, replacing with template...')
      try {
        fs.unlinkSync(dbPath)
      } catch (e) {
        console.error('[Prisma] Could not delete empty db file:', e)
      }
      copyTemplateDb(dbPath)
    }
  }

  return `file:${dbPath}`
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
