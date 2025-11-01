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
        "fixed left-0 top-[8.5rem] h-[calc(100vh-8.5rem)] bg-secondary border-r-2 border-accent transition-all duration-300 z-40 shadow-xl",
        isOpen ? "w-72" : "w-0 -translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-left font-medium",
                  "border-l-4 hover:bg-secondary/80",
                  isActive 
                    ? "bg-primary/10 border-accent text-accent shadow-md" 
                    : "border-transparent text-sidebar-foreground hover:border-accent/50 hover:text-accent"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="uppercase tracking-wide text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
