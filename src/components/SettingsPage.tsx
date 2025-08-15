import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from "@/hooks/useTheme";
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface SettingsPageProps {
  onExportTasks: () => void;
  onImportTasks: (file: File) => Promise<void>;
}

export function SettingsPage({ onExportTasks, onImportTasks }: SettingsPageProps) {
  const { setTheme } = useTheme();
  const { settings, updateInterfaceSettings, updateNotificationSettings, updateAutomationSettings } = useSettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onImportTasks(file);
        toast({ title: "Успех", description: "Задачи успешно импортированы." });
      } catch (error) {
        toast({ variant: "destructive", title: "Ошибка", description: "Не удалось импортировать задачи." });
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Настройки</h2>
      <Tabs defaultValue="interface">
        <TabsList>
          <TabsTrigger value="interface">Интерфейс</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="automation">Автоматизация</TabsTrigger>
          <TabsTrigger value="backup">Резервное копирование</TabsTrigger>
        </TabsList>

        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle>Внешний вид</CardTitle>
              <CardDescription>Настройте внешний вид приложения.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Тема оформления</Label>
                <Select
                  value={settings.interface.theme}
                  onValueChange={(value: 'light' | 'dark') => {
                    updateInterfaceSettings({ theme: value });
                    setTheme(value);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Светлая</SelectItem>
                    <SelectItem value="dark">Темная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="taskTileSize">Размер плиток задач</Label>
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
                    <SelectItem value="large">Большой</SelectItem>
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

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Управляйте напоминаниями и звуками.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableReminders">Включить напоминания</Label>
                <Switch 
                  id="enableReminders"
                  checked={settings.notifications.enableReminders}
                  onCheckedChange={(checked) => updateNotificationSettings({ enableReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notificationSound" className="text-muted-foreground">Звук уведомлений</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">(в разработке)</span>
                  <Switch 
                    id="notificationSound"
                    checked={settings.notifications.notificationSound}
                    onCheckedChange={(checked) => updateNotificationSettings({ notificationSound: checked })}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Автоматизация</CardTitle>
              <CardDescription>Автоматизируйте рутинные действия.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoArchive" className="text-muted-foreground">Авто-архивация выполненных задач</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">(в разработке)</span>
                  <Switch 
                    id="autoArchive"
                    checked={settings.automation.autoArchiveCompleted}
                    onCheckedChange={(checked) => updateAutomationSettings({ autoArchiveCompleted: checked })}
                    disabled
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="deleteOverdue" className="text-muted-foreground">Удалять просроченные задачи</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">(в разработке)</span>
                  <Switch 
                    id="deleteOverdue"
                    checked={settings.automation.deleteOverdue}
                    onCheckedChange={(checked) => updateAutomationSettings({ deleteOverdue: checked })}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Резервное копирование</CardTitle>
              <CardDescription>Сохраняйте и восстанавливайте свои задачи.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={onExportTasks} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              <Button onClick={handleImportClick} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Импорт
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileImport} 
                className="hidden" 
                accept=".json"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
