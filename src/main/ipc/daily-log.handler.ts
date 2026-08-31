import { ipcMain } from 'electron';
import { dailyLogService } from '../services/daily-log.service';
import { CreateDailyLogDto, UpdateDailyLogDto } from '../../shared/dtos/daily-log.dto';

export function registerDailyLogHandlers(): void {
  ipcMain.handle('dailyLog:getByDate', async (_, { date }: { date: string }) => {
    return dailyLogService.getByDate(date);
  });

  ipcMain.handle('dailyLog:getAll', async () => {
    return dailyLogService.getAll();
  });

  ipcMain.handle('dailyLog:create', async (_, data: CreateDailyLogDto) => {
    return dailyLogService.create(data);
  });

  ipcMain.handle('dailyLog:update', async (_, { id, data }: { id: string, data: UpdateDailyLogDto }) => {
    return dailyLogService.update(id, data);
  });
}
