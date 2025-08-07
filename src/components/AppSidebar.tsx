import { CheckSquare, Archive, List, Settings, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Мои задачи", url: "/", icon: List },
  { title: "Выполненные", url: "/completed", icon: CheckSquare },
  { title: "Архив", url: "/archived", icon: Archive },
  { title: "Настройки", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  onAddTask: () => void;
}

export function AppSidebar({ onAddTask }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = (isActive: boolean) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Кнопка добавления задачи */}
        <div className="mb-6">
          <Button 
            onClick={onAddTask}
            className={`w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium ${
              isCollapsed ? "px-2" : "px-4"
            }`}
            size={isCollapsed ? "icon" : "default"}
          >
            <Plus className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Добавить задачу</span>}
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center p-3 rounded-lg transition-colors ${getNavClass(isActive(item.url))}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}