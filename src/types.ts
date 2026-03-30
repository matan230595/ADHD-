// src/types.ts

export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  parentId?: string | null;
  status: TaskStatus;
  createdAt: string;          // ISO string
  scheduledFor?: string;      // date (YYYY-MM-DD)
  isToday?: boolean;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  interrupted: boolean;
}

export interface MainTaskOfDay {
  date: string;    // YYYY-MM-DD
  title: string;
}

export interface AppState {
  tasks: Task[];
  focusSessions: FocusSession[];
  mainTasks: MainTaskOfDay[];
}
