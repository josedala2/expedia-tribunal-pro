import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Plus, Users, DollarSign, CheckCircle, FolderOpen, BarChart3, MessageSquare, Shield } from "lucide-react";
import { useState } from "react";

interface GestaoPensionistasProps {
  onBack: () => void;
}

export default function GestaoPensionistas({ onBack }: GestaoPensionistasProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: "cadastro",
      icon: Users,
      title: "Cadastro de Aposentados",
      description: "Registar e manter dados pessoais",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      id: "pensoes",
      icon: DollarSign,
      title: "Gestão de Pensões",
      description: "Calcular e controlar pagamentos",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      id: "prova-vida",
      icon: CheckCircle,
      title: "Prova de Vida",
      description: "Garantir a atualização e existência do beneficiário",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      id: "documentos",
      icon: FolderOpen,
      title: "Documentos",
      description: "Arquivar e gerir provas, BI, etc.",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      id: "relatorios",
      icon: BarChart3,
      title: "Relatórios",
      description: "Apoiar auditorias e controlo financeiro",
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      id: "comunicacao",
      icon: MessageSquare,
      title: "Comunicação",
      description: "Relacionamento com os aposentados",
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20"
    },
    {
      id: "seguranca",
      icon: Shield,
      title: "Perfis e Segurança",
      description: "Garantir confidencialidade e rastreabilidade",
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <LogOut className="h-6 w-6" />
                  Gestão de Pensionistas / Reformados
                </h1>
                <p className="text-sm text-muted-foreground">Gerir informações e processos de pensionistas e reformados</p>
              </div>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Registar Pensionista
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${module.borderColor}`}
                onClick={() => setSelectedModule(module.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {module.description}
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
