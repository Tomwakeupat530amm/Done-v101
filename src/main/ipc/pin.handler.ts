// src/main/ipc/pin.handler.ts
import { ipcMain } from 'electron'
import { pinService } from '../services/pin.service'

export function registerPinHandlers(): void {
  ipcMain.handle('pin:isEnabled', async () => {
    return pinService.isPinEnabled()
  })

  ipcMain.handle('pin:verify', async (_event, pin: string) => {
    return pinService.verifyPin(pin)
  })

  ipcMain.handle('pin:set', async (_event, pin: string) => {
    await pinService.setPin(pin)
    return { success: true }
  })

  ipcMain.handle('pin:disable', async () => {
    await pinService.disablePin()
    return { success: true }
  })

  console.log('[IPC] PIN handlers registered')
}
