import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';

const Archive = () => {
  const { tasks, unarchiveTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tagsFilter, setTagsFilter] = useState('');

  const archivedTasks = useMemo(() => {
    return tasks.filter(task => task.isArchived);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return archivedTasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(task => 
        priorityFilter === 'all' || task.priority === priorityFilter
      )
      .filter(task => 
        !tagsFilter || (task.tags && task.tags.some(tag => tag.toLowerCase().includes(tagsFilter.toLowerCase())))
      );
  }, [archivedTasks, searchTerm, priorityFilter, tagsFilter]);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Архив задач</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input 
          placeholder="Поиск по ключевым словам..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Фильтр по приоритету" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все приоритеты</SelectItem>
            <SelectItem value="low">Низкий</SelectItem>
            <SelectItem value="medium">Средний</SelectItem>
            <SelectItem value="high">Высокий</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          placeholder="Фильтр по тегам..."
          value={tagsFilter}
          onChange={(e) => setTagsFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm">Приоритет: {task.priority}</span>
                  <Button variant="outline" onClick={() => unarchiveTask(task.id)}>
                    Разархивировать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">Архив пуст или задачи не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default Archive;
