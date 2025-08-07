export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'completed' | 'archived';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'weekdays';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  dueTime?: string;
  repeat: RepeatType;
  tags: string[];
  createdAt: Date;
  completedAt?: Date;
  archivedAt?: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  dueTime: string;
  repeat: RepeatType;
  tags: string[];
}