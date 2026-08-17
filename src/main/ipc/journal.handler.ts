// src/main/ipc/journal.handler.ts
import { ipcMain } from 'electron'
import { journalService } from '../services/journal.service'
import type { SaveJournalEntryDto as SaveJournalDto } from '../../shared/dtos/journal.dto'

export function registerJournalHandlers(): void {
  ipcMain.handle('journal:save', async (_event, dto: SaveJournalDto) => {
    return await journalService.saveJournalEntry(dto)
  })

  ipcMain.handle('journal:getByDate', async (_event, { date }: { date: string }) => {
    return await journalService.getJournalByDate(date)
  })
}
