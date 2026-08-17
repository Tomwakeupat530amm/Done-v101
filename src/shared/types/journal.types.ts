// src/shared/types/journal.types.ts
export interface JournalEntry {
  id: string
  date: string
  morningIntention: string | null
  eveningReflection: string | null
  freeWrite: string | null
  wins: string // JSON array
  gratitude: string // JSON array
  tomorrowFocus: string | null
  isDraft: boolean
  wordCount: number
  createdAt: Date | string
  updatedAt: Date | string
}
