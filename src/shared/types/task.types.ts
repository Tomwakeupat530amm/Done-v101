export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  pomodoroSessions: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  order?: number;
  pomodoroSessions?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  order?: number;
  pomodoroSessions?: number;
}

