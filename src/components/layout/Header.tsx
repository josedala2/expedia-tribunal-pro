import { Menu, Bell, Search, User, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const horizontalMenuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "processes", label: "Processos" },
  { id: "prestacao-contas", label: "Prestação de Contas" },
  { id: "visto", label: "Visto" },
];

export const Header = ({ onToggleSidebar, isSidebarOpen, currentView, onNavigate }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-50 border-b-4 border-accent">
      {/* Top Bar - Vermelho */}
      <div className="h-16 bg-primary">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="hover:bg-primary-hover text-primary-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-sm bg-accent flex items-center justify-center shadow-lg">
                <Scale className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground tracking-wide">TRIBUNAL DE CONTAS</h1>
                <p className="text-xs text-primary-foreground/90 uppercase tracking-widest">Sistema de Gestão de Processos</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              <Input
                placeholder="Pesquisar processos..."
                className="pl-9 w-64 bg-secondary text-secondary-foreground border-accent focus:ring-accent"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative hover:bg-primary-hover text-primary-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full animate-pulse"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary-hover text-primary-foreground">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Menu - Preto */}
      <nav className="bg-secondary border-b border-accent">
        <div className="px-6 flex items-center gap-1">
          {horizontalMenuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all
                  border-b-2 hover:bg-secondary/80
                  ${isActive 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-secondary-foreground hover:text-accent'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
