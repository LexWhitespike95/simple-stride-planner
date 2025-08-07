import { Calendar, Clock, Tag, MoreVertical } from "lucide-react";
import { Task, Priority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: {
    bgClass: "bg-priority-high-bg border-priority-high",
    dotClass: "bg-priority-high",
    label: "Высокий"
  },
  medium: {
    bgClass: "bg-priority-medium-bg border-priority-medium",
    dotClass: "bg-priority-medium",
    label: "Средний"
  },
  low: {
    bgClass: "bg-priority-low-bg border-priority-low",
    dotClass: "bg-priority-low",
    label: "Низкий"
  }
};

export function TaskCard({ task, onEdit, onComplete, onArchive, onDelete }: TaskCardProps) {
  const config = priorityConfig[task.priority];
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-task-hover animate-fade-in ${config.bgClass}`}>
      {/* Индикатор приоритета */}
      <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${config.dotClass}`} />
      
      {/* Заголовок и меню */}
      <div className="flex items-start justify-between mb-2 ml-6">
        <h3 className="font-semibold text-foreground leading-tight flex-1 pr-2">
          {task.title}
        </h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onComplete(task.id)}>
              {task.status === 'completed' ? 'Отменить выполнение' : 'Завершить'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(task.id)}>
              В архив
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Описание */}
      {task.description && (
        <p className="text-muted-foreground text-sm mb-3 ml-6 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Дата и время */}
      <div className="flex items-center gap-4 mb-3 ml-6 text-sm text-muted-foreground">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        {task.dueTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(task.dueTime)}</span>
          </div>
        )}
      </div>

      {/* Теги */}
      {task.tags.length > 0 && (
        <div className="flex items-center gap-2 ml-6">
          <Tag className="h-3 w-3 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}