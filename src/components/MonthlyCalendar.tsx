import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from '@/types';
import { TaskDialog } from './TaskDialog';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';

interface MonthlyCalendarProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskArchive: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
  openDaySidebar: (date: Date) => void;
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function MonthlyCalendar({ tasks, onTaskCreate, onTaskUpdate, onTaskArchive, getTasksForDate, openDaySidebar }: MonthlyCalendarProps) {
  const { settings } = useSettings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      !task.isArchived &&
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))))
    );
  }, [tasks, searchTerm]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - firstDayWeekday);

  const calendarDays: Date[] = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    openDaySidebar(date);
  };

  const handleTaskClick = (task: Task, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTask(task);
    setSelectedDate(null);
    setIsTaskDialogOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      onTaskUpdate(selectedTask.id, taskData);
    } else if (selectedDate) {
      onTaskCreate({
        ...taskData,
        dueDate: selectedDate
      });
    }
    setIsTaskDialogOpen(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-priority-high';
      case 'medium': return 'bg-priority-medium';
      case 'low': return 'bg-priority-low';
      default: return 'bg-muted';
    }
  };

  const tileSizeStyles = {
    small: 'min-h-[90px]',
    normal: 'min-h-[120px]',
    large: 'min-h-[150px]',
  };
  const dayCardClass = tileSizeStyles[settings.interface.taskTileSize] || tileSizeStyles.normal;

  const taskItemStyle = {
    small: 'p-0.5 rounded text-[10px]',
    normal: 'p-1 rounded text-xs',
    large: 'p-1.5 rounded text-sm',
  }[settings.interface.taskTileSize] || 'p-1 rounded text-xs';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-2xl font-semibold">
            {MONTHS[month]} {year}
          </h2>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-1/3">
          <Input 
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 p-4">
        {/* Weekday headers */}
        {WEEKDAYS.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = new Date().toDateString() === date.toDateString();
          const dayTasks = getTasksForDate(date).filter(task => filteredTasks.includes(task));

          return (
            <Card
              key={index}
              className={cn(
                "p-2 cursor-pointer transition-colors hover:bg-muted/50",
                dayCardClass,
                !isCurrentMonth && "text-muted-foreground bg-muted/20",
                isToday && "ring-2 ring-primary"
              )}
              onClick={() => handleDayClick(date)}
            >
              <div className="flex flex-col h-full">
                <span className={cn(
                  "text-sm font-medium mb-1",
                  isToday && "text-primary font-bold"
                )}>
                  {date.getDate()}
                </span>
                
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={cn(
                        "cursor-pointer hover:opacity-80 text-white",
                        taskItemStyle,
                        getPriorityColor(task.priority),
                        task.completed && "opacity-50 line-through"
                      )}
                      onClick={(e) => handleTaskClick(task, e)}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
                
                {dayTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        selectedDate={selectedDate}
        onSubmit={handleTaskSubmit}
        onArchive={onTaskArchive} // Pass the function here
      />
    </div>
  );
}