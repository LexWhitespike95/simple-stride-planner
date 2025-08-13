import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskDialog } from '@/components/TaskDialog';
import { useState, useMemo } from 'react';
import { Task } from '@/types';
import { Plus } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

const List = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { settings } = useSettings();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      !task.isArchived &&
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))))
    );
  }, [tasks, searchTerm]);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskDialogOpen(false);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-priority-high';
      case 'medium': return 'border-l-priority-medium';
      case 'low': return 'border-l-priority-low';
      default: return 'border-l-muted';
    }
  };

  const tileSizeStyles = {
    small: {
      card: 'p-2',
      title: 'text-sm font-medium',
      description: 'text-xs',
      dueDate: 'text-xs',
    },
    normal: {
      card: 'p-4',
      title: 'font-medium',
      description: 'text-sm',
      dueDate: 'text-xs',
    },
    large: {
      card: 'p-6',
      title: 'text-lg font-semibold',
      description: 'text-base',
      dueDate: 'text-sm',
    },
  };

  const currentSize = settings.interface.taskTileSize;
  const styles = tileSizeStyles[currentSize] || tileSizeStyles.normal;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Список задач</h1>
        <div className="w-1/3">
          <Input 
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleNewTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Новая задача
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Задач пока нет</p>
              <Button onClick={handleNewTask} className="mt-4">
                Создать первую задачу
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={cn(`border-l-4 cursor-pointer hover:shadow-md transition-shadow`, getPriorityColor(task.priority))}
              onClick={() => handleEditTask(task)}
            >
              <CardContent className={cn("flex items-center gap-4", styles.card)}>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => 
                    updateTask(task.id, { completed: checked as boolean })
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1">
                  <h3 className={cn(styles.title, task.completed ? 'line-through text-muted-foreground' : '')}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={cn(styles.description, "text-muted-foreground mt-1")}>
                      {task.description}
                    </p>
                  )}
                  <p className={cn(styles.dueDate, "text-muted-foreground mt-2")}>
                    Срок: {task.dueDate.toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                <div className={cn(`px-2 py-1 rounded-full text-xs font-medium`, {
                  'bg-priority-high/10 text-priority-high': task.priority === 'high',
                  'bg-priority-medium/10 text-priority-medium': task.priority === 'medium',
                  'bg-priority-low/10 text-priority-low': task.priority !== 'high' && task.priority !== 'medium',
                })}>
                  {task.priority === 'high' ? 'Высокий' : 
                   task.priority === 'medium' ? 'Средний' : 'Низкий'}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        onSubmit={handleTaskSubmit}
        onDelete={deleteTask}
      />
    </div>
  );
};

export default List;
