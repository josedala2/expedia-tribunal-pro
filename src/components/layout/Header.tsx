import { Menu, Bell, Search, User, Settings, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoTC from "@/assets/logo-tc.png";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const horizontalMenuItems = [
  { id: "usuarios", label: "Utilizadores", icon: User },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "documentos", label: "Documentos", icon: FileText },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export const Header = ({ onToggleSidebar, isSidebarOpen, currentView, onNavigate }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top Bar */}
      <div className="h-16 bg-card">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="hover:bg-secondary"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
            
            <div className="flex items-center gap-3">
              <img src={logoTC} alt="Tribunal de Contas Angola" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-lg font-bold text-foreground">Tribunal de Contas</h1>
                <p className="text-xs text-muted-foreground">Sistema Nacional de Gestão de Processos</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Menu */}
      <nav className="bg-card border-t border-border">
        <div className="px-6 flex items-center gap-2">
          {horizontalMenuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-4 py-3 text-sm font-medium transition-all
                  flex items-center gap-2 border-b-2
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
