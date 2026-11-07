import { ipcMain } from 'electron'
import { taskService } from '../services/task.service'
import { widgetService } from '../services/widget.service'
import type { CreateTaskDto, UpdateTaskDto, TaskStatus } from '../../shared/types/task.types'

export function registerTaskHandlers() {
  ipcMain.handle('task:getAll', async () => {
    return taskService.getAll()
  })

  ipcMain.handle('task:getDashboardTasks', async () => {
    return taskService.getDashboardTasks()
  })

  ipcMain.handle('task:getWidgetTasks', async () => {
    return taskService.getWidgetTasks()
  })

  ipcMain.handle('task:create', async (_, dto: CreateTaskDto) => {
    const result = await taskService.create(dto)
    widgetService.broadcastTasksChanged()
    return result
  })

  ipcMain.handle('task:update', async (_, payload: { id: string, dto: UpdateTaskDto }) => {
    const result = await taskService.update(payload.id, payload.dto)
    widgetService.broadcastTasksChanged()
    return result
  })

  ipcMain.handle('task:delete', async (_, id: string) => {
    await taskService.delete(id)
    widgetService.broadcastTasksChanged()
  })

  ipcMain.handle('task:updateOrder', async (_, payload: { id: string, newStatus: TaskStatus, newOrder: number }) => {
    const result = await taskService.updateOrder(payload.id, payload.newStatus, payload.newOrder)
    widgetService.broadcastTasksChanged()
    return result
  })

  ipcMain.handle('task:incrementPomodoro', async (_, id: string) => {
    const result = await taskService.incrementPomodoro(id)
    widgetService.broadcastTasksChanged()
    return result
  })
}

