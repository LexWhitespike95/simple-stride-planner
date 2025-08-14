
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types";
import { useMemo } from "react";

const Analytics = () => {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const overdueTasks = tasks.filter(
      (task) => !task.completed && new Date(task.dueDate) < now
    ).length;
    const activeTasks = totalTasks - completedTasks - overdueTasks;

    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      activeTasks,
      productivity,
    };
  }, [tasks]);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Аналитика</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Продуктивность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productivity}%</div>
            <p className="text-xs text-muted-foreground">
              Процент выполненных задач
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполнено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Всего выполненных задач
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В процессе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              Задач в работе
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Просрочено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Задач с истекшим сроком
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;