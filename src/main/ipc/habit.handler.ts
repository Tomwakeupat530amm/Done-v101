// src/main/ipc/habit.handler.ts
// Atomic Recovery — Habit IPC Handler Registration

import { ipcMain } from 'electron'
import { habitService } from '../services/habit.service'
import type { CreateHabitDto, UpdateHabitDto } from '../../shared/types/ipc.types'

export function registerHabitHandlers(): void {
  // ─── Get all habits ──────────────────────────────────────────
  ipcMain.handle('habit:getAll', async () => {
    return habitService.getAllHabits()
  })

  // ─── Get today's status ──────────────────────────────────────
  ipcMain.handle('habit:getTodayStatus', async () => {
    return habitService.getTodayStatus()
  })

  // ─── Create habit ────────────────────────────────────────────
  ipcMain.handle('habit:create', async (_event, dto: CreateHabitDto) => {
    return habitService.createHabit(dto)
  })

  // ─── Update habit ────────────────────────────────────────────
  ipcMain.handle('habit:update', async (_event, { id, data }: { id: string; data: UpdateHabitDto }) => {
    return habitService.updateHabit(id, data)
  })

  // ─── Delete habit (archive) ──────────────────────────────────
  ipcMain.handle('habit:delete', async (_event, { id }: { id: string }) => {
    await habitService.deleteHabit(id)
  })

  // ─── Check-in ────────────────────────────────────────────────
  ipcMain.handle('habit:checkIn', async (_event, { id, date }: { id: string; date: string }) => {
    return habitService.checkIn(id, date)
  })

  // ─── Get habit logs (heatmap) ────────────────────────────────
  ipcMain.handle('habit:getLogs', async (_event, { id, year }: { id: string; year: number }) => {
    return habitService.getHabitLogs(id, year)
  })

  console.log('[IPC] Habit handlers registered')
}
