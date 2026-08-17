// src/main/ipc/identity.handler.ts
import { ipcMain } from 'electron'
import { identityService } from '../services/identity.service'
import type { UpdateProfileDto, UpdateFutureSelfDto, CreateStatementDto as AddStatementDto } from '../../shared/dtos/identity.dto'

export function registerIdentityHandlers(): void {
  ipcMain.handle('identity:getProfile', async () => {
    return await identityService.getProfile()
  })

  ipcMain.handle('identity:updateProfile', async (_event, dto: UpdateProfileDto) => {
    return await identityService.updateProfile(dto)
  })

  ipcMain.handle('identity:getFutureSelf', async () => {
    return await identityService.getFutureSelf()
  })

  ipcMain.handle('identity:updateFutureSelf', async (_event, dto: UpdateFutureSelfDto) => {
    return await identityService.updateFutureSelf(dto)
  })

  ipcMain.handle('identity:getStatements', async () => {
    return await identityService.getStatements()
  })

  ipcMain.handle('identity:addStatement', async (_event, dto: AddStatementDto) => {
    return await identityService.addStatement(dto)
  })

  ipcMain.handle('identity:removeStatement', async (_event, { id }: { id: string }) => {
    await identityService.removeStatement(id)
  })

  ipcMain.handle('identity:reorderStatements', async (_event, { ids }: { ids: string[] }) => {
    await identityService.reorderStatements(ids)
  })
}
