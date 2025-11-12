import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Calendar, GitBranch, Users, Clock, DollarSign, FileText, Bell, Archive, Plug, Flag } from "lucide-react";

interface AdminConfigMenuProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const menuItems = [
  { id: "admin-settings", title: "Configurações Gerais", description: "Gerir configurações do sistema", icon: Settings },
  { id: "calendario-judicial", title: "Calendário Judicial", description: "Gerir feriados e dias não úteis", icon: Calendar },
  { id: "regras-distribuicao", title: "Regras de Distribuição", description: "Configurar distribuição de processos", icon: GitBranch },
  { id: "mapa-letra-juiz", title: "Mapa Letra de Juiz", description: "Atribuição de letras aos juízes", icon: Users },
  { id: "sla-regras", title: "Regras de SLA", description: "Definir prazos por tipo de processo", icon: Clock },
  { id: "emolumentos-tabela", title: "Tabela de Emolumentos", description: "Configurar valores de emolumentos", icon: DollarSign },
  { id: "doc-templates", title: "Templates de Documentos", description: "Gerir templates de documentos", icon: FileText },
  { id: "notificacao-templates", title: "Templates de Notificação", description: "Configurar templates de notificações", icon: Bell },
  { id: "retencao-regras", title: "Regras de Retenção", description: "Definir políticas de retenção", icon: Archive },
  { id: "integration-config", title: "Configurações de Integração", description: "Gerir integrações externas", icon: Plug },
  { id: "feature-flags", title: "Feature Flags", description: "Ativar/desativar funcionalidades", icon: Flag },
];

export default function AdminConfigMenu({ onBack, onNavigate }: AdminConfigMenuProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Administração & Configurações</h1>
          <p className="text-muted-foreground">Gerir configurações do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => onNavigate(item.id)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}