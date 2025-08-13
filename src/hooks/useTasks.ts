import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types';
import { useSettings } from './useSettings';

type RawTask = Omit<Task, 'dueDate' | 'createdAt' | 'updatedAt' | 'lastNotifiedAt'> & {
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  lastNotifiedAt?: string;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { settings } = useSettings();

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('stride-planner-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks.map((task: RawTask) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        lastNotifiedAt: task.lastNotifiedAt ? new Date(task.lastNotifiedAt) : undefined,
      })));
    }
  }, []);

  // Notification and reminder logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextMinute = new Date(now.getTime() + 60000);

      if (!settings.notifications.enableReminders) {
        return;
      }

      tasks.forEach(task => {
        if (task.completed || task.isArchived || !task.time) {
          return; // Skip irrelevant tasks
        }

        const [hours, minutes] = task.time.split(':').map(Number);
        const taskDateTime = new Date(task.dueDate);
        taskDateTime.setHours(hours, minutes, 0, 0);

        // Check if the task is due within the next minute and hasn't been notified for this time yet
        if (taskDateTime >= now && taskDateTime < nextMinute) {
          
          // Simple check to avoid re-notifying for the same due time if interval runs twice
          if (task.lastNotifiedAt && new Date(task.lastNotifiedAt).getTime() === taskDateTime.getTime()) {
            return;
          }

          console.log(`[useTasks] Sending notification for task due now: ${task.title}`);
          
          window.electronAPI?.showNotification({
            title: task.title,
            body: task.description || 'Напоминание о задаче'
          }).then(success => {
            if (success && settings.notifications.notificationSound) {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.error("Error playing sound:", e));
            }
          });

          // Mark as notified at the due time to prevent duplicates
          updateTask(task.id, { lastNotifiedAt: taskDateTime });
        }
      });

    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    }
  }, [tasks, settings.notifications, updateTask]);

  // Automation logic
  useEffect(() => {
    const runAutoArchive = () => {
      if (!settings.automation.autoArchiveCompleted) return;
      
      const tasksToArchive = tasks.filter(t => t.completed && !t.isArchived);
      if (tasksToArchive.length > 0) {
        console.log(`[Automation] Archiving ${tasksToArchive.length} completed tasks.`);
        const updatedTasks = tasks.map(task => 
          task.completed && !task.isArchived ? { ...task, isArchived: true, updatedAt: new Date() } : task
        );
        saveTasks(updatedTasks);
      }
    };

    const runDeleteOverdue = () => {
      if (!settings.automation.deleteOverdue) return;
      const now = new Date();
      
      const tasksToDelete = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate < now && !t.completed;
      });

      if (tasksToDelete.length > 0) {
        console.log(`[Automation] Deleting ${tasksToDelete.length} overdue tasks.`);
        const remainingTasks = tasks.filter(t => !tasksToDelete.some(deleted => deleted.id === t.id));
        saveTasks(remainingTasks);
      }
    };

    runAutoArchive();
    runDeleteOverdue();

  }, [tasks, settings.automation, saveTasks]);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('stride-planner-tasks', JSON.stringify(newTasks));
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id'>>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const archiveTask = (id: string) => {
    updateTask(id, { isArchived: true });
  };

  const unarchiveTask = (id: string) => {
    updateTask(id, { isArchived: false });
  };

  const getTasksForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (task.isArchived) return false;

      const taskDueDate = new Date(task.dueDate);
      taskDueDate.setHours(0, 0, 0, 0);

      if (taskDueDate > targetDate) return false; // Task is in the future

      if (!task.recurrenceRule || task.recurrenceRule === 'none') {
        return taskDueDate.getTime() === targetDate.getTime();
      }

      const dayOfWeek = targetDate.getDay(); // Sunday = 0, Saturday = 6

      switch (task.recurrenceRule) {
        case 'daily':
          return true; // Occurs every day from its due date
        
        case 'weekly':
          return taskDueDate.getDay() === dayOfWeek;

        case 'monthly':
          return taskDueDate.getDate() === targetDate.getDate();

        case 'yearly':
          return taskDueDate.getDate() === targetDate.getDate() &&
                 taskDueDate.getMonth() === targetDate.getMonth();

        case 'weekdays':
          return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday

        case 'weekends':
          return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

        default:
          return false;
      }
    });
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stride-planner-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importTasks = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string);
          const validatedTasks = importedTasks.map((task: RawTask) => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          }));
          saveTasks(validatedTasks);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    archiveTask, 
    unarchiveTask,
    getTasksForDate,
    exportTasks,
    importTasks
  };
};
