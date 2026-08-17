// src/shared/dtos/journal.dto.ts
import { z } from 'zod'

export const SaveJournalEntryDtoSchema = z.object({
  date: z.string(), // "YYYY-MM-DD"
  morningIntention: z.string().optional().nullable(),
  morningGratitude: z.string().optional().nullable(), // raw newline-separated string
  eveningReflection: z.string().optional().nullable(),
  eveningWins: z.string().optional().nullable(),      // raw newline-separated string
  freeWrite: z.string().optional().nullable(),
  tomorrowFocus: z.string().optional().nullable(),
  isDraft: z.boolean().default(false)
})

export type SaveJournalEntryDto = z.infer<typeof SaveJournalEntryDtoSchema>
