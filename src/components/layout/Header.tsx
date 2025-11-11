import { Menu, Bell, User, Settings, FileText, BarChart3, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import headerBanner from "@/assets/header-banner.png";
import { UserMenu } from "./UserMenu";

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
      <div className="relative h-[80px] sm:h-[100px] md:h-[140px] lg:h-[160px] overflow-hidden">
        <img 
          src={headerBanner} 
          alt="Tribunal de Contas Angola" 
          className="w-full h-full object-cover"
        />
        
        {/* Menu Toggle and Action Buttons Overlay */}
        <div className="absolute top-1 sm:top-2 md:top-3 lg:top-4 left-1 sm:left-2 md:left-4 right-1 sm:right-2 md:right-4 flex items-start justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
          </Button>
          
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 lg:h-12 lg:w-12"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full">
              <UserMenu />
            </div>
          </div>
        </div>
        
        {/* Subtitle Overlay */}
        <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 lg:bottom-4 left-1 sm:left-2 md:left-4">
          <p className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold drop-shadow-lg">
            Sistema Nacional de Gestão de Processos
          </p>
        </div>
      </div>

      {/* Horizontal Menu */}
      <nav className="bg-slate-900 border-t border-border h-10 sm:h-12 md:h-14 lg:h-16 overflow-x-auto scrollbar-hide">
        <div className="h-full px-1 sm:px-2 md:px-6 lg:px-10 flex items-center justify-between min-w-max">
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
            {horizontalMenuItemsLeft.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 
                    text-[10px] sm:text-xs md:text-sm font-bold transition-all
                    flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 
                    border-b-2 sm:border-b-3 h-full whitespace-nowrap
                    ${isActive 
                      ? 'border-primary text-white bg-primary/5' 
                      : 'border-transparent text-white hover:text-white/80 hover:bg-secondary/50'
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5 shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
            {horizontalMenuItemsRight.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 
                    text-[10px] sm:text-xs md:text-sm font-bold transition-all
                    flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 
                    border-b-2 sm:border-b-3 h-full whitespace-nowrap
                    ${isActive 
                      ? 'border-primary text-white bg-primary/5' 
                      : 'border-transparent text-white hover:text-white/80 hover:bg-secondary/50'
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5 shrink-0" />
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
