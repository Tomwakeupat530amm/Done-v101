import { z } from 'zod';

export const CreateDailyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  mood: z.number().min(1).max(5).nullable().optional(),
  energy: z.number().min(1).max(5).nullable().optional(),
  emotionTags: z.array(z.string()).optional(),
  morningIntention: z.string().nullable().optional(),
  gratitude: z.array(z.string()).optional(),
  reflection: z.string().nullable().optional(),
});

export type CreateDailyLogDto = z.infer<typeof CreateDailyLogSchema>;

export const UpdateDailyLogSchema = CreateDailyLogSchema.partial().extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type UpdateDailyLogDto = z.infer<typeof UpdateDailyLogSchema>;
