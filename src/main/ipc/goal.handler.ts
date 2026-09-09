import { ipcMain } from 'electron'
import { goalService } from '../services/goal.service'
import type { CreateGoalDto, UpdateGoalDto } from '../../shared/types/goal.types'

export function registerGoalHandlers() {
  ipcMain.handle('goal:getAll', async () => {
    return goalService.getAll()
  })

  ipcMain.handle('goal:getDueGoals', async () => {
    return goalService.getDueGoals()
  })

  ipcMain.handle('goal:create', async (_, dto: CreateGoalDto) => {
    return goalService.create(dto)
  })

  ipcMain.handle('goal:update', async (_, payload: { id: string; dto: UpdateGoalDto }) => {
    return goalService.update(payload.id, payload.dto)
  })

  ipcMain.handle('goal:delete', async (_, id: string) => {
    await goalService.delete(id)
  })

  ipcMain.handle('goal:markCompleted', async (_, id: string) => {
    return goalService.markCompleted(id)
  })

  ipcMain.handle('goal:extendTargetDate', async (_, payload: { id: string; newTargetDate: string }) => {
    return goalService.extendTargetDate(payload.id, payload.newTargetDate)
  })

  ipcMain.handle('goal:markNotified', async (_, id: string) => {
    return goalService.markNotified(id)
  })
}
