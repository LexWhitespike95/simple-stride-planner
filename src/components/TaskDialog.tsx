import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Tag, Repeat } from "lucide-react";
import { Task, TaskFormData, Priority, RepeatType } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (data: TaskFormData, taskId?: string) => void;
}

const priorityOptions = [
  { value: 'high' as Priority, label: 'Высокий', color: 'bg-priority-high' },
  { value: 'medium' as Priority, label: 'Средний', color: 'bg-priority-medium' },
  { value: 'low' as Priority, label: 'Низкий', color: 'bg-priority-low' },
];

const repeatOptions = [
  { value: 'none' as RepeatType, label: 'Не повторять' },
  { value: 'daily' as RepeatType, label: 'Каждый день' },
  { value: 'weekdays' as RepeatType, label: 'В будние дни' },
  { value: 'weekly' as RepeatType, label: 'Каждую неделю' },
  { value: 'monthly' as RepeatType, label: 'Каждый месяц' },
];

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    repeat: 'none',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
        dueTime: task.dueTime || '',
        repeat: task.repeat,
        tags: task.tags,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        dueTime: '',
        repeat: 'none',
        tags: [],
      });
    }
    setTagInput('');
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSave(formData, task?.id);
    onOpenChange(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-bounce-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {task ? 'Редактировать задачу' : 'Новая задача'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Название задачи
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Введите название задачи"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Описание
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Добавьте описание (необязательно)"
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Приоритет */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Приоритет</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Дата и время */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Дата
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime" className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Время
              </Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Повтор */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Repeat className="h-4 w-4" />
              Повтор
            </Label>
            <Select
              value={formData.repeat}
              onValueChange={(value: RepeatType) => setFormData(prev => ({ ...prev, repeat: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {repeatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Теги */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Теги
            </Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Добавить тег"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                size="icon"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={!formData.title.trim()}
            >
              {task ? 'Сохранить' : 'Создать задачу'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}