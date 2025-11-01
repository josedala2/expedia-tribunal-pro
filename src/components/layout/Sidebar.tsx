import { LayoutDashboard, FileText, FolderCheck, Eye, FileBarChart, DollarSign, Users, Inbox, ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuGroups = [
  {
    title: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "expedientes", label: "Expedientes Internos e Externos", icon: Inbox },
    ]
  },
  {
    title: "Prestação de Contas",
    items: [
      { id: "prestacao-contas", label: "Processos", icon: FolderCheck },
      { id: "expediente-prestacao", label: "Expediente de Relatório", icon: FileText },
      { id: "tramitacao-prestacao", label: "Tramitação do Processo", icon: FileBarChart },
      { id: "cumprimento-despachos-prestacao", label: "Cumprimento de Despachos", icon: CheckCircle },
      { id: "saida-expediente-prestacao", label: "Saída de Expediente", icon: Inbox },
      { id: "prestacao-soberania", label: "Órgãos de Soberania", icon: FolderCheck },
    ]
  },
  {
    title: "Processo de Visto",
    items: [
      { id: "visto", label: "Processos de Visto", icon: Eye },
      { id: "expediente-processual", label: "Expediente Processual", icon: FileText },
      { id: "tramitacao-visto", label: "Tramitação do Processo", icon: FileBarChart },
      { id: "cumprimento-despachos", label: "Cumprimento de Despachos", icon: CheckCircle },
      { id: "saida-expediente-visto", label: "Saída de Expediente", icon: Inbox },
      { id: "cobranca-emolumentos", label: "Cobrança de Emolumentos", icon: FileText },
      { id: "despacho-promocao", label: "Despacho de Promoção", icon: FileBarChart },
      { id: "cumprimento-despachos-geral", label: "Cumprimento de Despachos", icon: CheckCircle },
      { id: "oficios-remessa", label: "Ofícios de Remessa", icon: FileText },
      { id: "expedientes-saida", label: "Expediente de Saída", icon: Inbox },
    ]
  },
  {
    title: "Fiscalização OGE",
    items: [
      { id: "fiscalizacao", label: "Fiscalização OGE", icon: FileBarChart },
      { id: "expediente-fiscalizacao", label: "Expediente de Relatórios", icon: FileText },
      { id: "tramitacao-fiscalizacao", label: "Tramitação OGE", icon: FileBarChart },
      { id: "parecer-trimestral", label: "Parecer Trimestral", icon: FileText },
      { id: "saida-expediente-fiscalizacao", label: "Saída de Expediente", icon: Inbox },
    ]
  },
  {
    title: "Processo de Multa",
    items: [
      { id: "multas", label: "Processos de Multa", icon: DollarSign },
    ]
  }
];

export const Sidebar = ({ isOpen, currentView, onNavigate }: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Principal"]);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupActive = (items: any[]) => {
    return items?.some(item => currentView === item.id);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[9.5rem] h-[calc(100vh-9.5rem)] bg-card border-r border-border transition-all duration-300 z-40 shadow-sm",
        isOpen ? "w-80" : "w-0 -translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-4 space-y-3">
          {menuGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.title);
            const hasActiveItem = isGroupActive(group.items);
            
            return (
              <Card key={group.title} className={cn(
                "overflow-hidden transition-all",
                hasActiveItem && "border-primary/50"
              )}>
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm transition-colors",
                    hasActiveItem 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  <span>{group.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="p-2 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left text-sm",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
