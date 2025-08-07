import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskDialog } from "@/components/TaskDialog";
import { useTasks } from "@/hooks/useTasks";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { addTask } = useTasks();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const handleAddTask = (formData: any) => {
    addTask(formData);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar onAddTask={() => setIsTaskDialogOpen(true)} />
        
        <div className="flex-1 flex flex-col">
          {/* Глобальный заголовок с кнопкой сайдбара */}
          <header className="h-14 flex items-center border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="px-4">
              <SidebarTrigger className="h-8 w-8" />
            </div>
            <div className="flex-1 px-4">
              <h2 className="font-semibold text-foreground">Персональный менеджер задач</h2>
            </div>
          </header>

          {/* Основной контент */}
          <main className="flex-1">
            {children}
          </main>
        </div>

        {/* Глобальный диалог добавления задачи */}
        <TaskDialog
          open={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          onSave={handleAddTask}
        />
      </div>
    </SidebarProvider>
  );
}