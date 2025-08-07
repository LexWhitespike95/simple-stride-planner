import { useState, useEffect } from 'react';
import { Settings } from '@/types';

const defaultSettings: Settings = {
  interface: {
    theme: 'light',
    taskTileSize: 'normal',
    defaultView: 'calendar'
  },
  notifications: {
    enableReminders: true,
    notificationSound: true,
    defaultReminderTime: 30
  },
  automation: {
    autoArchiveCompleted: false,
    deleteOverdue: false,
    defaultRepeat: 'daily'
  },
  backup: {}
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('stride-planner-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('stride-planner-settings', JSON.stringify(updatedSettings));
  };

  const updateInterfaceSettings = (interfaceSettings: Partial<Settings['interface']>) => {
    updateSettings({
      interface: { ...settings.interface, ...interfaceSettings }
    });
  };

  const updateNotificationSettings = (notificationSettings: Partial<Settings['notifications']>) => {
    updateSettings({
      notifications: { ...settings.notifications, ...notificationSettings }
    });
  };

  const updateAutomationSettings = (automationSettings: Partial<Settings['automation']>) => {
    updateSettings({
      automation: { ...settings.automation, ...automationSettings }
    });
  };

  return {
    settings,
    updateSettings,
    updateInterfaceSettings,
    updateNotificationSettings,
    updateAutomationSettings
  };
};