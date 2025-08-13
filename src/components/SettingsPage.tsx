import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { Download, Upload } from 'lucide-react';

interface SettingsPageProps {
  onExportTasks: () => void;
  onImportTasks: (file: File) => Promise<void>;
}

export function SettingsPage({ onExportTasks, onImportTasks }: SettingsPageProps) {
  const { settings, updateInterfaceSettings, updateNotificationSettings, updateAutomationSettings } = useSettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    onExportTasks();
    toast({
      title: "Экспорт завершен",
      description: "Задачи успешно экспортированы в JSON файл",
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onImportTasks(file);
      toast({
        title: "Импорт завершен",
        description: "Задачи успешно импортированы",
      });
    } catch (error) {
      toast({
        title: "Ошибка импорта",
        description: "Не удалось импортировать задачи. Проверьте формат файла.",
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>
      
      <Tabs defaultValue="interface" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="interface">Интерфейс</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="automation">Автоматизация</TabsTrigger>
          <TabsTrigger value="backup">Резервное копирование</TabsTrigger>
        </TabsList>

        <TabsContent value="interface" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки интерфейса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Тема оформления</Label>
                <Select
                  value={settings.interface.theme}
                  onValueChange={(value: 'light' | 'dark') => 
                    updateInterfaceSettings({ theme: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Светлая</SelectItem>
                    <SelectItem value="dark">Тёмная</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="taskSize">Размер плиток задач</Label>
                <Select
                  value={settings.interface.taskTileSize}
                  onValueChange={(value: 'normal' | 'large') => 
                    updateInterfaceSettings({ taskTileSize: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Обычный</SelectItem>
                    <SelectItem value="large">Увеличенный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="defaultView">Вид по умолчанию</Label>
                <Select
                  value={settings.interface.defaultView}
                  onValueChange={(value: 'calendar' | 'week' | 'list') => 
                    updateInterfaceSettings({ defaultView: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calendar">Календарь</SelectItem>
                    <SelectItem value="week">Неделя</SelectItem>
                    <SelectItem value="list">Список</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableReminders">Включить напоминания</Label>
                <Switch
                  id="enableReminders"
                  checked={settings.notifications.enableReminders}
                  onCheckedChange={(checked) => 
                    updateNotificationSettings({ enableReminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notificationSound">Звук уведомления</Label>
                <Switch
                  id="notificationSound"
                  checked={settings.notifications.notificationSound}
                  onCheckedChange={(checked) => 
                    updateNotificationSettings({ notificationSound: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reminderTime">Время напоминания по умолчанию</Label>
                <Select
                  value={settings.notifications.defaultReminderTime.toString()}
                  onValueChange={(value) => 
                    updateNotificationSettings({ defaultReminderTime: parseInt(value) as 10 | 30 | 60 })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 минут</SelectItem>
                    <SelectItem value="30">30 минут</SelectItem>
                    <SelectItem value="60">1 час</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки автоматизации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoArchive">Автоархивировать выполненные задачи</Label>
                <Switch
                  id="autoArchive"
                  checked={settings.automation.autoArchiveCompleted}
                  onCheckedChange={(checked) => 
                    updateAutomationSettings({ autoArchiveCompleted: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="deleteOverdue">Удалять просроченные задачи</Label>
                <Switch
                  id="deleteOverdue"
                  checked={settings.automation.deleteOverdue}
                  onCheckedChange={(checked) => 
                    updateAutomationSettings({ deleteOverdue: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="defaultRepeat">Повторы по умолчанию</Label>
                <Select
                  value={settings.automation.defaultRepeat}
                  onValueChange={(value: 'daily' | 'weekly' | 'weekdays') => 
                    updateAutomationSettings({ defaultRepeat: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Ежедневно</SelectItem>
                    <SelectItem value="weekly">Еженедельно</SelectItem>
                    <SelectItem value="weekdays">По будням</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Резервное копирование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Экспортировать задачи</Label>
                  <p className="text-sm text-muted-foreground">
                    Сохранить все задачи в JSON файл
                  </p>
                </div>
                <Button onClick={handleExport} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Импортировать задачи</Label>
                  <p className="text-sm text-muted-foreground">
                    Загрузить задачи из JSON файла
                  </p>
                </div>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Upload className="h-4 w-4" />
                  Импорт
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}