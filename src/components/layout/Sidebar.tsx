import { LayoutDashboard, FileText, FolderCheck, Eye, FileBarChart, DollarSign, Users, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expedientes", label: "Expedientes Internos", icon: Inbox },
  { id: "prestacao-contas", label: "Prestação de Contas", icon: FolderCheck },
  { id: "visto", label: "Processos de Visto", icon: Eye },
  { id: "fiscalizacao", label: "Fiscalização OGE", icon: FileBarChart },
  { id: "multas", label: "Processos de Multa", icon: DollarSign },
];

export const Sidebar = ({ isOpen, currentView, onNavigate }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-[10.5rem] h-[calc(100vh-10.5rem)] bg-card border-r border-border transition-all duration-300 z-40 shadow-sm",
        isOpen ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left text-sm font-bold",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
