import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  selectedDate?: Date | null;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (id: string) => void;
}

export function TaskDialog({ 
  open, 
  onOpenChange, 
  task, 
  selectedDate, 
  onSubmit,
  onDelete 
}: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCompleted(task.completed);
      setDueDate(task.dueDate.toISOString().split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCompleted(false);
      if (selectedDate) {
        setDueDate(selectedDate.toISOString().split('T')[0]);
      } else {
        setDueDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [task, selectedDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed,
      dueDate: new Date(dueDate),
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Редактировать задачу' : 'Новая задача'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание (необязательно)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="priority">Приоритет</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Низкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate">Дата выполнения</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {task && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(checked as boolean)}
              />
              <Label htmlFor="completed">Выполнено</Label>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {task && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit">
                {task ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}