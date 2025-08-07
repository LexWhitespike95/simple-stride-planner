import { SettingsPage } from '@/components/SettingsPage';
import { useTasks } from '@/hooks/useTasks';

const Settings = () => {
  const { exportTasks, importTasks } = useTasks();

  return (
    <SettingsPage
      onExportTasks={exportTasks}
      onImportTasks={importTasks}
    />
  );
};

export default Settings;