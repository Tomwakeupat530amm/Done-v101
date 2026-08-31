export interface DailyLog {
  id: string;
  date: string;
  mood: number | null;
  energy: number | null;
  emotionTags: string[];
  morningIntention: string | null;
  gratitude: string[];
  reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
}
