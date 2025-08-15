import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { addDays, addWeeks, addMonths, addYears, endOfDay } from 'date-fns';

// --- Helper function to calculate the next due date ---
function getNextDueDate(currentDueDate: Date, rule: Task['recurrenceRule']): Date | null {
  switch (rule) {
    case 'daily':
      return addDays(currentDueDate, 1);
    case 'weekly':
      return addWeeks(currentDueDate, 1);
    case 'monthly':
      return addMonths(currentDueDate, 1);
    case 'yearly':
      return addYears(currentDueDate, 1);
    default:
      return null;
  }
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('stride-planner-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        lastNotifiedAt: task.lastNotifiedAt ? new Date(task.lastNotifiedAt) : undefined,
      })));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('stride-planner-tasks', JSON.stringify(newTasks));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTasks: Task[] = [];
    const now = new Date();
    
    const firstTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      completed: false,
    };

    // If it's a recurring task, generate instances
    if (taskData.recurrenceRule && taskData.recurrenceRule !== 'none') {
      const seriesId = crypto.randomUUID();
      firstTask.seriesId = seriesId;
      newTasks.push(firstTask);

      let currentDueDate = new Date(firstTask.dueDate);
      const threeMonthsFromNow = addMonths(now, 3); // Generate for the next 3 months

      while (true) {
        const nextDueDate = getNextDueDate(currentDueDate, taskData.recurrenceRule);

        if (nextDueDate && nextDueDate <= threeMonthsFromNow) {
          newTasks.push({
            ...firstTask,
            id: crypto.randomUUID(),
            seriesId: seriesId,
            dueDate: nextDueDate,
          });
          currentDueDate = nextDueDate;
        } else {
          break; // Stop if next date is null or beyond the generation horizon
        }
      }
    } else {
      // It's a single, non-recurring task
      newTasks.push(firstTask);
    }

    saveTasks([...tasks, ...newTasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    // The old recurrence logic is removed from here.
    // A more complex logic would be needed to update a whole series,
    // but for now, we update only a single instance.
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    // A more complex logic would be needed to delete a whole series.
    // For now, we delete only a single instance.
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const archiveTask = (id: string) => {
    updateTask(id, { isArchived: true, completed: true });
  };

  const unarchiveTask = (id: string) => {
    updateTask(id, { isArchived: false });
  };

  const getTasksForDate = (date: Date) => {
    const start = date;
    const end = endOfDay(date);
    return tasks.filter(task => {
      if (task.isArchived) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= start && taskDate <= end;
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
          const validatedTasks = importedTasks.map((task: any) => ({
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