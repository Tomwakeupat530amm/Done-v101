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

  ipcMain.handle('dailyLog:getSummary', async (_, { date }: { date: string }) => {
    return dailyLogService.getDailySummary(date);
  });

  ipcMain.handle('dailyLog:getAllFeed', async () => {
    return dailyLogService.getAllFeed();
  });

  ipcMain.handle('dailyLog:saveMorning', async (_, { date, morningIntention }: { date: string; morningIntention: string }) => {
    return dailyLogService.saveMorning(date, morningIntention);
  });

  ipcMain.handle('dailyLog:saveEvening', async (_, { date, reflection }: { date: string; reflection: string }) => {
    return dailyLogService.saveEvening(date, reflection);
  });

  ipcMain.handle('dailyLog:create', async (_, data: CreateDailyLogDto) => {
    return dailyLogService.create(data);
  });

  ipcMain.handle('dailyLog:update', async (_, { id, data }: { id: string; data: UpdateDailyLogDto }) => {
    return dailyLogService.update(id, data);
  });
}
