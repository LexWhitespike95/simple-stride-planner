export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  time?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  recurrenceRule?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends';
  isArchived?: boolean;
  lastNotifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seriesId?: string;
};

export interface Settings {
  interface: {
    theme: 'light' | 'dark';
    taskTileSize: 'normal' | 'large';
    defaultView: 'calendar' | 'week' | 'list';
  };
  notifications: {
    enableReminders: boolean;
    notificationSound: boolean;
    defaultReminderTime: 10 | 30 | 60; // minutes
  };
  automation: {
    autoArchiveCompleted: boolean;
    deleteOverdue: boolean;
    defaultRepeat: 'daily' | 'weekly' | 'weekdays';
  };
  backup: {
    lastExport?: Date;
    lastImport?: Date;
  };
}