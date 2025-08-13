export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

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