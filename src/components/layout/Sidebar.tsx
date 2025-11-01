import { LayoutDashboard, FileText, FolderCheck, Eye, FileBarChart, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "processes", label: "Processos", icon: FileText },
  { id: "prestacao-contas", label: "Prestação de Contas", icon: FolderCheck },
  { id: "visto", label: "Processos de Visto", icon: Eye },
  { id: "fiscalizacao", label: "Fiscalização OGE", icon: FileBarChart },
  { id: "multas", label: "Processos de Multa", icon: DollarSign },
  { id: "usuarios", label: "Utilizadores", icon: Users },
];

export const Sidebar = ({ isOpen, currentView, onNavigate }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-40",
        isOpen ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};
