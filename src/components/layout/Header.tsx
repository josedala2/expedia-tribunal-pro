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
      <div className="h-56 bg-card">
        <div className="h-full px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="hover:bg-secondary h-20 w-20"
            >
              <Menu className="h-12 w-12 text-foreground" />
            </Button>
            
            <div className="flex items-center gap-8">
              <img src={logoTC} alt="Tribunal de Contas Angola" className="h-40 w-40 object-contain" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">Tribunal de Contas</h1>
                <p className="text-xl text-muted-foreground font-semibold">Sistema Nacional de Gestão de Processos</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary h-20 w-20">
              <Bell className="h-10 w-10" />
              <span className="absolute top-2 right-2 h-4 w-4 bg-primary rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-secondary h-20 w-20">
              <User className="h-10 w-10" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Menu */}
      <nav className="bg-card border-t border-border h-20">
        <div className="h-full px-12 flex items-center gap-4">
          {horizontalMenuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-8 py-5 text-base font-bold transition-all
                  flex items-center gap-3 border-b-3 h-full
                  ${isActive 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }
                `}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
