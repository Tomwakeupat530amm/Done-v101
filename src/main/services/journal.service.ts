// src/main/services/journal.service.ts
import { prisma } from '../database/prisma.client'
import type { SaveJournalEntryDto } from '../../shared/dtos/journal.dto'

export class JournalService {
  async getJournalByDate(date: string) {
    return prisma.journalEntry.findUnique({
      where: { date }
    })
  }

  async saveJournalEntry(dto: SaveJournalEntryDto) {
    const { date, ...data } = dto

    // Parse raw newline-separated strings into JSON arrays
    const winsArray = JSON.stringify(
      (data.eveningWins ?? '').split('\n').map(s => s.trim()).filter(Boolean)
    )
    const gratitudeArray = JSON.stringify(
      (data.morningGratitude ?? '').split('\n').map(s => s.trim()).filter(Boolean)
    )

    // Calculate word count across all text fields
    const allText = [
      data.morningIntention,
      data.morningGratitude,
      data.freeWrite,
      data.eveningReflection,
      data.eveningWins
    ].filter(Boolean).join(' ')
    const wordCount = allText.trim() === '' ? 0 : allText.trim().split(/\s+/).length

    return prisma.journalEntry.upsert({
      where: { date },
      update: {
        morningIntention: data.morningIntention,
        eveningReflection: data.eveningReflection,
        freeWrite: data.freeWrite,
        wins: winsArray,
        gratitude: gratitudeArray,
        tomorrowFocus: data.tomorrowFocus,
        wordCount,
        isDraft: data.isDraft ?? false
      },
      create: {
        date,
        morningIntention: data.morningIntention,
        eveningReflection: data.eveningReflection,
        freeWrite: data.freeWrite,
        wins: winsArray,
        gratitude: gratitudeArray,
        tomorrowFocus: data.tomorrowFocus,
        wordCount,
        isDraft: data.isDraft ?? false
      }
    })
  }
}

export const journalService = new JournalService()
