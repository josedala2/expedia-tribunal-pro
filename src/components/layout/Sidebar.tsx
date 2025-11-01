import { LayoutDashboard, FileText, FolderCheck, Eye, FileBarChart, DollarSign, Users, Inbox, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expedientes", label: "Expedientes Internos e Externos", icon: Inbox },
  { 
    id: "prestacao-contas", 
    label: "Prestação de Contas", 
    icon: FolderCheck,
    submenu: [
      { id: "prestacao-contas", label: "Prestação de Contas" },
      { id: "expediente-prestacao", label: "Expediente de Relatório" },
      { id: "tramitacao-prestacao", label: "Tramitação do Processo" },
      { id: "cumprimento-despachos-prestacao", label: "Cumprimento de Despachos" },
      { id: "saida-expediente-prestacao", label: "Saída de Expediente" },
      { id: "prestacao-soberania", label: "Órgãos de Soberania" },
    ]
  },
  { 
    id: "visto", 
    label: "Processos de Visto", 
    icon: Eye,
    submenu: [
      { id: "visto", label: "Processos de Visto" },
      { id: "expediente-processual", label: "Expediente Processual" },
      { id: "tramitacao-visto", label: "Tramitação do Processo" },
      { id: "cumprimento-despachos", label: "Cumprimento de Despachos" },
      { id: "saida-expediente-visto", label: "Saída de Expediente" },
    ]
  },
  { 
    id: "fiscalizacao", 
    label: "Fiscalização OGE", 
    icon: FileBarChart,
    submenu: [
      { id: "fiscalizacao", label: "Fiscalização OGE" },
      { id: "expediente-fiscalizacao", label: "Expediente de Relatórios" },
      { id: "tramitacao-fiscalizacao", label: "Tramitação OGE" },
      { id: "parecer-trimestral", label: "Parecer Trimestral" },
      { id: "saida-expediente-fiscalizacao", label: "Saída de Expediente" },
    ]
  },
  { id: "multas", label: "Processos de Multa", icon: DollarSign },
  { id: "cobranca-emolumentos", label: "Cobrança de Emolumentos", icon: FileText },
];

export const Sidebar = ({ isOpen, currentView, onNavigate }: SidebarProps) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["prestacao-contas", "visto", "fiscalizacao"]);

  const toggleSubmenu = (itemId: string) => {
    setExpandedMenus(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isSubmenuActive = (submenuItems: any[]) => {
    return submenuItems?.some(subItem => currentView === subItem.id);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[9.5rem] h-[calc(100vh-9.5rem)] bg-card border-r border-border transition-all duration-300 z-40 shadow-sm",
        isOpen ? "w-80" : "w-0 -translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-5 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            const isSubmenuItemActive = hasSubmenu && isSubmenuActive(item.submenu);
            
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.id);
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left text-sm font-bold",
                    (isActive || isSubmenuItemActive)
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {hasSubmenu && (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )
                  )}
                </button>
                
                {hasSubmenu && isExpanded && (
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = currentView === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => onNavigate(subItem.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left text-xs font-medium",
                            isSubActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
