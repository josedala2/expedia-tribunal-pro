import { LayoutDashboard, FileText, FolderCheck, Eye, FileBarChart, DollarSign, Users, Inbox, ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuGroups = [
  {
    id: "dashboard-group",
    title: "Dashboard",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    id: "expedientes-group",
    title: "Expedientes Internos e Externos",
    items: [
      { id: "expedientes", label: "Expedientes Internos e Externos", icon: Inbox },
    ]
  },
  {
    id: "prestacao-contas-group",
    title: "Prestação de Contas",
    items: [
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
    ]
  },
  {
    id: "visto-group",
    title: "Processo de Visto",
    items: [
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
      { id: "cobranca-emolumentos", label: "Cobrança de Emolumentos", icon: FileText },
      { id: "despacho-promocao", label: "Despacho de Promoção", icon: FileBarChart },
      { id: "cumprimento-despachos-geral", label: "Cumprimento de Despachos", icon: CheckCircle },
      { id: "oficios-remessa", label: "Ofícios de Remessa", icon: FileText },
      { id: "expedientes-saida", label: "Expediente de Saída", icon: Inbox },
    ]
  },
  {
    id: "fiscalizacao-group",
    title: "Fiscalização OGE",
    items: [
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
    ]
  },
  {
    id: "multas-group",
    title: "Processo de Multa",
    items: [
      { id: "multas", label: "Processos de Multa", icon: DollarSign },
    ]
  },
];

export const Sidebar = ({ isOpen, currentView, onNavigate }: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["dashboard-group", "expedientes-group", "prestacao-contas-group", "visto-group", "fiscalizacao-group", "multas-group"]);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["prestacao-contas", "visto", "fiscalizacao"]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

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

  const isGroupActive = (items: any[]) => {
    return items.some(item => 
      currentView === item.id || (item.submenu && isSubmenuActive(item.submenu))
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[9.5rem] h-[calc(100vh-9.5rem)] bg-card border-r border-border transition-all duration-300 z-40 shadow-sm",
        isOpen ? "w-80" : "w-0 -translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-4 pt-8 space-y-3">
          {menuGroups.map((group) => {
            const isActive = isGroupActive(group.items);
            const isExpanded = expandedGroups.includes(group.id);
            
            return (
              <Card key={group.id} className={cn(
                "transition-all",
                isActive && "border-primary/50 bg-primary/5"
              )}>
                <CardHeader 
                  className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {group.title}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="p-2 pt-0 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = currentView === item.id;
                      const hasSubmenu = item.submenu && item.submenu.length > 0;
                      const isSubmenuExpanded = expandedMenus.includes(item.id);
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
                              "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all text-left text-xs font-medium",
                              (isItemActive || isSubmenuItemActive)
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {hasSubmenu && (
                              isSubmenuExpanded ? (
                                <ChevronDown className="h-3 w-3 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-3 w-3 flex-shrink-0" />
                              )
                            )}
                          </button>
                          
                          {hasSubmenu && isSubmenuExpanded && (
                            <div className="ml-6 space-y-1">
                              {item.submenu.map((subItem) => {
                                const isSubActive = currentView === subItem.id;
                                return (
                                  <button
                                    key={subItem.id}
                                    onClick={() => onNavigate(subItem.id)}
                                    className={cn(
                                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all text-left text-xs",
                                      isSubActive
                                        ? "bg-primary/10 text-primary font-medium"
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
                  </CardContent>
                )}
              </Card>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
