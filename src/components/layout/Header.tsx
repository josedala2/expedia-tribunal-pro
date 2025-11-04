import { Menu, Bell, User, Settings, FileText, BarChart3, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import headerBanner from "@/assets/header-banner.png";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const horizontalMenuItemsLeft = [
  { id: "comunicacoes-internas", label: "Comunicações Internas", icon: MessagesSquare },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "documentos", label: "Documentos", icon: FileText },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const horizontalMenuItemsRight = [
  { id: "usuarios", label: "Utilizadores", icon: User },
];

export const Header = ({ onToggleSidebar, isSidebarOpen, currentView, onNavigate }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-card border-b-2 border-border shadow-md">
      {/* Top Bar - Banner Image */}
      <div className="relative h-[120px] md:h-[160px] overflow-hidden">
        <img 
          src={headerBanner} 
          alt="Tribunal de Contas Angola" 
          className="w-full h-full object-cover"
        />
        
        {/* Menu Toggle and Action Buttons Overlay */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 flex items-start justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm h-10 w-10 md:h-12 md:w-12"
          >
            <Menu className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </Button>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm h-10 w-10 md:h-12 md:w-12"
            >
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-white" />
              <span className="absolute top-1 right-1 h-2 w-2 md:h-2.5 md:w-2.5 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm h-10 w-10 md:h-12 md:w-12"
            >
              <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </Button>
          </div>
        </div>
        
        {/* Subtitle Overlay */}
        <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
          <p className="text-white text-xs md:text-sm font-semibold drop-shadow-lg">
            Sistema Nacional de Gestão de Processos
          </p>
        </div>
      </div>

      {/* Horizontal Menu - Hidden on mobile, scrollable on tablet */}
      <nav className="bg-slate-900 border-t border-border h-12 md:h-16 overflow-x-auto">
        <div className="h-full px-2 md:px-10 flex items-center justify-between min-w-max md:min-w-0">
          <div className="flex items-center gap-1 md:gap-3">
            {horizontalMenuItemsLeft.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm font-bold transition-all
                    flex items-center gap-1.5 md:gap-2.5 border-b-3 h-full whitespace-nowrap
                    ${isActive 
                      ? 'border-primary text-white bg-primary/5' 
                      : 'border-transparent text-white hover:text-white/80 hover:bg-secondary/50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            {horizontalMenuItemsRight.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm font-bold transition-all
                    flex items-center gap-1.5 md:gap-2.5 border-b-3 h-full whitespace-nowrap
                    ${isActive 
                      ? 'border-primary text-white bg-primary/5' 
                      : 'border-transparent text-white hover:text-white/80 hover:bg-secondary/50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
