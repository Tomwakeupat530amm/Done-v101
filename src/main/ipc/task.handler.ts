import { ipcMain } from 'electron'
import { taskService } from '../services/task.service'
import type { CreateTaskDto, UpdateTaskDto, TaskStatus } from '../../shared/types/task.types'

export function registerTaskHandlers() {
  ipcMain.handle('task:getAll', async () => {
    return taskService.getAll()
  })

  ipcMain.handle('task:getDashboardTasks', async () => {
    return taskService.getDashboardTasks()
  })

  ipcMain.handle('task:create', async (_, dto: CreateTaskDto) => {
    return taskService.create(dto)
  })

  ipcMain.handle('task:update', async (_, payload: { id: string, dto: UpdateTaskDto }) => {
    return taskService.update(payload.id, payload.dto)
  })

  ipcMain.handle('task:delete', async (_, id: string) => {
    await taskService.delete(id)
  })

  ipcMain.handle('task:updateOrder', async (_, payload: { id: string, newStatus: TaskStatus, newOrder: number }) => {
    return taskService.updateOrder(payload.id, payload.newStatus, payload.newOrder)
  })

  ipcMain.handle('task:incrementPomodoro', async (_, id: string) => {
    return taskService.incrementPomodoro(id)
  })
}

