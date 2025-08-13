import { MonthlyCalendar } from '@/components/MonthlyCalendar';
import { useTasks } from '@/hooks/useTasks';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, getTasksForDate } = useTasks();

  return (
    <div className="h-screen">
      <MonthlyCalendar
        tasks={tasks}
        onTaskCreate={addTask}
        onTaskUpdate={updateTask}
        getTasksForDate={getTasksForDate}
      />
    </div>
  );
};

export default Index;
