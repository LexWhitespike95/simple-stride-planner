import { useState } from "react";
import { Search, Archive, Grid, List } from "lucide-react";
import { Task } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Archived = () => {
  const {
    getArchivedTasks,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    archiveTask,
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const archivedTasks = getArchivedTasks();

  // Фильтрация задач
  const filteredTasks = archivedTasks.filter(task => {
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleUpdateTask = (formData: any, taskId?: string) => {
    if (taskId) {
      updateTask(taskId, formData);
      setEditingTask(undefined);
    }
  };

  const handleCloseDialog = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Заголовок страницы */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Архив задач</h1>
              <p className="text-muted-foreground">
                {archivedTasks.length === 0 
                  ? "В архиве пока нет задач" 
                  : `В архиве: ${archivedTasks.length} задач`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-6">
        {/* Панель поиска и фильтров */}
        <div className="mb-6 space-y-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в архиве..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Переключатель вида */}
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">
              Найдено: {filteredTasks.length}
            </Badge>

            <div className="flex gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Список задач */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Archive className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "Ничего не найдено" : "Архив пуст"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Попробуйте изменить критерии поиска"
                : "Архивированные задачи будут отображаться здесь"}
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onComplete={toggleTaskStatus}
                onArchive={archiveTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Диалог редактирования задачи */}
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
        onSave={handleUpdateTask}
      />
    </div>
  );
};

export default Archived;