export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXTENDED' | 'ABANDONED';
export type GoalCategory = 'RECOVERY' | 'HEALTH' | 'CAREER' | 'PERSONAL' | 'GENERAL';

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategory | string;
  targetDate: string; // ISO string YYYY-MM-DD or full ISO
  status: GoalStatus | string;
  completedAt: string | null;
  notifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalDto {
  title: string;
  description?: string | null;
  category?: GoalCategory | string;
  targetDate: string; // YYYY-MM-DD or ISO string
}

export interface UpdateGoalDto {
  title?: string;
  description?: string | null;
  category?: GoalCategory | string;
  targetDate?: string;
  status?: GoalStatus | string;
  completedAt?: string | null;
  notifiedAt?: string | null;
}
