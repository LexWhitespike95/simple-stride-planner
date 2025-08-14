import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from '@/types';
import { TaskDialog } from './TaskDialog';
import { cn } from '@/lib/utils';
import { format, add, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

interface WeeklyCalendarProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskArchive: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
  openDaySidebar: (date: Date) => void;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function WeeklyCalendar({ tasks, onTaskCreate, onTaskUpdate, onTaskArchive, getTasksForDate, openDaySidebar }: WeeklyCalendarProps) {
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

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const calendarDays: Date[] = [];
  let day = weekStart;
  while (day <= weekEnd) {
    calendarDays.push(day);
    day = add(day, { days: 1 });
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => add(prevDate, { weeks: direction === 'prev' ? -1 : 1 }));
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-2xl font-semibold">
            {format(weekStart, 'd MMMM', { locale: ru })} - {format(weekEnd, 'd MMMM yyyy', { locale: ru })}
          </h2>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('next')}
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
      <div className="flex-1 p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {WEEKDAYS.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const isToday = new Date().toDateString() === date.toDateString();
            const dayTasks = getTasksForDate(date).filter(task => filteredTasks.includes(task));

            return (
              <Card
                key={index}
                className={cn(
                  "min-h-[100px] p-2 cursor-pointer transition-colors hover:bg-muted/50",
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
                  
                  <div className="flex-1 space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={cn(
                          "p-1 rounded text-xs cursor-pointer hover:opacity-80 text-white",
                          getPriorityColor(task.priority),
                          task.completed && "opacity-50 line-through"
                        )}
                        onClick={(e) => handleTaskClick(task, e)}
                      >
                        {task.title.substring(0, 20)}
                        {task.title.length > 20 && '...'}
                      </div>
                    ))}
                    
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayTasks.length - 3} еще
                      </div>
                    )}
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