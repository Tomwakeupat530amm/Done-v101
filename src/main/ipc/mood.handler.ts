// src/main/ipc/mood.handler.ts
import { ipcMain } from 'electron'
import { moodService } from '../services/mood.service'
import type { LogMoodDto } from '../../shared/dtos/mood.dto'

export function registerMoodHandlers(): void {
  ipcMain.handle('mood:log', async (_event, dto: LogMoodDto) => {
    return await moodService.logMood(dto)
  })

  ipcMain.handle('mood:getByDate', async (_event, { date }: { date: string }) => {
    return await moodService.getMoodsByDate(date)
  })
}
