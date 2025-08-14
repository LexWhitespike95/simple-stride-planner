import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MonthlyCalendar } from '@/components/MonthlyCalendar';
import { WeeklyCalendar } from '@/components/WeeklyCalendar'; // Import WeeklyCalendar
import { useSettings } from '@/hooks/useSettings';
import { useTasks } from '@/hooks/useTasks';

const Index = ({ openDaySidebar }: { openDaySidebar: (date: Date) => void }) => {
  const { tasks, addTask, updateTask, deleteTask, archiveTask, getTasksForDate } = useTasks();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const defaultView = settings.interface.defaultView;
    if (defaultView === 'list') {
      navigate(`/list`);
    }
  }, [settings.interface.defaultView, navigate]);

  const renderCalendar = () => {
    switch (settings.interface.defaultView) {
      case 'week':
        return (
          <WeeklyCalendar
            tasks={tasks}
            onTaskCreate={addTask}
            onTaskUpdate={updateTask}
            onTaskArchive={archiveTask}
            getTasksForDate={getTasksForDate}
            openDaySidebar={openDaySidebar}
          />
        );
      case 'calendar':
      default:
        return (
          <MonthlyCalendar
            tasks={tasks}
            onTaskCreate={addTask}
            onTaskUpdate={updateTask}
            onTaskArchive={archiveTask}
            getTasksForDate={getTasksForDate}
            openDaySidebar={openDaySidebar}
          />
        );
    }
  };

  return <div className="h-screen">{renderCalendar()}</div>;
};

export default Index;