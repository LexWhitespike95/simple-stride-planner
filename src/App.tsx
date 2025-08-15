import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; // <-- Import useEffect
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import List from "./pages/List";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Archive from "./pages/Archive";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Task } from "@/types";
import { TaskDialog } from "@/components/TaskDialog";
import { useSettings } from './hooks/useSettings'; // <-- Import useSettings

const queryClient = new QueryClient();

const App = () => {
  const [isDaySidebarOpen, setIsDaySidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Move useTasks and useSettings to the top-level component
  const { tasks, getTasksForDate, addTask, updateTask, deleteTask, archiveTask } = useTasks();
  const { settings } = useSettings();

  // This useEffect will run once and set up the interval for checking tasks.
  useEffect(() => {
    const checkTasks = () => {
      if (!settings.notifications.enableReminders) {
        return;
      }
      console.log("Checking for overdue tasks...");
      const now = new Date();
      tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        if (!task.completed && dueDate < now && !task.lastNotifiedAt) {
          console.log(`Task "${task.title}" is overdue. Sending notification.`);
          window.electronAPI.showNotification({
            title: 'Просроченная задача!',
            body: `Задача "${task.title}" должна была быть выполнена к ${dueDate.toLocaleDateString()}.`
          });
          // Mark as notified to prevent spam
          updateTask(task.id, { lastNotifiedAt: new Date() });
        }
      });
    };

    // Run every 60 seconds
    const intervalId = setInterval(checkTasks, 60000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [tasks, updateTask, settings.notifications.enableReminders]); // Rerun if tasks or settings change

  const openDaySidebar = (date: Date) => {
    setSelectedDate(date);
    setIsDaySidebarOpen(true);
  };

  const closeDaySidebar = () => {
    setIsDaySidebarOpen(false);
    setSelectedDate(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <header className="h-12 flex items-center border-b px-4">
                    <SidebarTrigger />
                    <h1 className="ml-4 font-semibold text-lg text-primary">
                      ToDoLex
                    </h1>
                  </header>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index openDaySidebar={openDaySidebar} />} />
                      <Route path="/list" element={<List />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/archive" element={<Archive />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <DayTasksSidebar
                    isOpen={isDaySidebarOpen}
                    onClose={closeDaySidebar}
                    date={selectedDate}
                    // Pass tasks and functions down as props
                    tasks={tasks}
                    getTasksForDate={getTasksForDate}
                    addTask={addTask}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    archiveTask={archiveTask}
                  />
                </div>
              </div>
            </SidebarProvider>
          </HashRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Define props for DayTasksSidebar
interface DayTasksSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  tasks: Task[];
  getTasksForDate: (date: Date) => Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
}

// Update DayTasksSidebar to receive props
function DayTasksSidebar({
  isOpen,
  onClose,
  date,
  tasks,
  getTasksForDate,
  addTask,
  updateTask,
  deleteTask,
  archiveTask
}: DayTasksSidebarProps) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!date) return null;

  const dayTasks = getTasksForDate(date).sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskDialogOpen(false);
    setSelectedTask(null);
  };

  const handleAddNewTask = () => {
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
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              Задачи на {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </SheetTitle>
            <SheetDescription>
              Просмотр и управление задачами на выбранный день.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Button onClick={handleAddNewTask} className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Добавить задачу
            </Button>
            <div className="space-y-3">
              {dayTasks.length > 0 ? (
                dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleEditTask(task)}
                    className={cn(
                      "p-3 border-l-4 rounded-r-lg cursor-pointer hover:bg-muted",
                      getPriorityColor(task.priority)
                    )}
                  >
                    <h4 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                    {task.time && <p className="text-sm text-muted-foreground">{task.time}</p>}
                    {task.description && <p className="text-sm mt-1 text-muted-foreground">{task.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">На этот день задач нет.</p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        selectedDate={date}
        onSubmit={handleTaskSubmit}
        onDelete={deleteTask}
        onArchive={archiveTask}
      />
    </>
  );
}

export default App;