import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus } from '@/types/task';

const STORAGE_KEY = 'personal-task-manager-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Загрузка задач из localStorage при инициализации
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Конвертируем строки дат обратно в объекты Date
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          archivedAt: task.archivedAt ? new Date(task.archivedAt) : undefined,
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      }
    }
  }, []);

  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      status: 'pending',
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      dueTime: formData.dueTime || undefined,
      repeat: formData.repeat,
      tags: formData.tags,
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, formData: TaskFormData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            title: formData.title,
            description: formData.description || undefined,
            priority: formData.priority,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            dueTime: formData.dueTime || undefined,
            repeat: formData.repeat,
            tags: formData.tags,
          }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined,
        };
      }
      return task;
    }));
  };

  const archiveTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'archived' as TaskStatus, archivedAt: new Date() }
        : task
    ));
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getActiveTasks = () => {
    return tasks.filter(task => task.status === 'pending');
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.status === 'completed');
  };

  const getArchivedTasks = () => {
    return tasks.filter(task => task.status === 'archived');
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    archiveTask,
    getTasksByStatus,
    getActiveTasks,
    getCompletedTasks,
    getArchivedTasks,
  };
}