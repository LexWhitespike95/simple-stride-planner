import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskDialog } from '@/components/TaskDialog';
import { useState } from 'react';
import { Task } from '@/types';
import { Plus } from 'lucide-react';

const List = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Список задач</h1>
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
          tasks.map((task) => (
            <Card 
              key={task.id} 
              className={`border-l-4 ${getPriorityColor(task.priority)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleEditTask(task)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => 
                    updateTask(task.id, { completed: checked as boolean })
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Срок: {task.dueDate.toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' 
                    ? 'bg-priority-high/10 text-priority-high' 
                    : task.priority === 'medium'
                    ? 'bg-priority-medium/10 text-priority-medium'
                    : 'bg-priority-low/10 text-priority-low'
                }`}>
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