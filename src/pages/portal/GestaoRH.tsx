import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Clock, 
  Calendar, 
  TrendingUp, 
  GraduationCap, 
  DollarSign, 
  FolderOpen, 
  LogOut,
  BarChart3
} from "lucide-react";

interface GestaoRHProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function GestaoRH({ onBack, onNavigate }: GestaoRHProps) {
  const menuItems = [
    {
      id: "cadastro-funcionarios",
      icon: Users,
      title: "Cadastro e Administração de Funcionários",
      description: "Gerir todo o registo e atualização de dados do pessoal",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      id: "gestao-contratos",
      icon: FileText,
      title: "Gestão de Contratos",
      description: "Controlar os vínculos formais entre a instituição e os colaboradores",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      id: "assiduidade-pontualidade",
      icon: Clock,
      title: "Assiduidade e Pontualidade",
      description: "Acompanhar a presença e frequência dos funcionários",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      id: "gestao-ferias-licencas",
      icon: Calendar,
      title: "Gestão de Férias e Licenças",
      description: "Automatizar pedidos, aprovações e acompanhamento de ausências",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      id: "formacao-desenvolvimento",
      icon: GraduationCap,
      title: "Formação e Desenvolvimento",
      description: "Gerir oportunidades de capacitação e histórico de formações",
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20"
    },
    {
      id: "gestao-remuneracoes",
      icon: DollarSign,
      title: "Gestão de Remunerações e Benefícios",
      description: "Controlar pagamentos, subsídios e benefícios",
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      id: "gestao-documental-rh",
      icon: FolderOpen,
      title: "Gestão Documental de RH",
      description: "Centralizar todos os ficheiros e documentos ligados aos funcionários",
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      id: "gestao-pensionistas",
      icon: LogOut,
      title: "Gestão de Pensionistas / Reformados",
      description: "Gerir informações e processos de pensionistas e reformados",
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      id: "relatorios-estatisticas-rh",
      icon: BarChart3,
      title: "Relatórios e Estatísticas",
      description: "Base para tomada de decisão e auditoria",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestão de Recursos Humanos</h1>
              <p className="text-sm text-muted-foreground">Sistema completo de administração de pessoal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${item.borderColor}`}
                onClick={() => onNavigate(`rh-${item.id}`)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
