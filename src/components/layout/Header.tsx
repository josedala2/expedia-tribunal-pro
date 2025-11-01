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
    <div className="sticky top-0 z-50 bg-card border-b-2 border-border shadow-md">
      {/* Top Bar */}
      <div className="h-auto pt-[2mm] pb-[2mm] bg-card">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="hover:bg-secondary h-16 w-16"
            >
              <Menu className="h-10 w-10 text-foreground" />
            </Button>
            
            <div className="flex items-center gap-3">
              <img src={logoTC} alt="Tribunal de Contas Angola" className="h-32 w-32 object-contain" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Tribunal de Contas</h1>
                <p className="text-lg text-muted-foreground font-semibold">Sistema Nacional de Gestão de Processos</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-secondary h-16 w-16 border-2 border-border rounded-lg"
            >
              <Bell className="h-8 w-8" />
              <span className="absolute top-1.5 right-1.5 h-3 w-3 bg-primary rounded-full"></span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-secondary h-16 w-16 border-2 border-border rounded-lg"
            >
              <User className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Menu */}
      <nav className="bg-card border-t border-border h-16">
        <div className="h-full px-10 flex items-center gap-3">
          {horizontalMenuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-6 py-4 text-sm font-bold transition-all
                  flex items-center gap-2.5 border-b-3 h-full
                  ${isActive 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
