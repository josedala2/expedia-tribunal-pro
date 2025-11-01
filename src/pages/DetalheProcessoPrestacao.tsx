import { ArrowLeft, FileText, Clock, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TramitacaoTimeline } from "@/components/processo/TramitacaoTimeline";
import { AcaoProcesso } from "@/components/processo/AcaoProcesso";
import { ProcessDocuments } from "@/components/processes/ProcessDocuments";

interface DetalheProcessoPrestacaoProps {
  onBack: () => void;
}

export const DetalheProcessoPrestacao = ({ onBack }: DetalheProcessoPrestacaoProps) => {
  const processo = {
    numero: "PC/2024/001",
    tipo: "Prestação de Contas",
    entidade: "Ministério da Educação",
    exercicio: "2023",
    responsavel: "Dr. João Silva",
    status: "Em Análise",
    prioridade: "Normal",
    dataAbertura: "15/01/2024",
    prazo: "30 dias",
    etapaAtual: "Verificação Preliminar",
    tramitacao: [
      {
        id: "1",
        etapa: "Registo de Entrada",
        responsavel: "Secretaria Geral",
        dataInicio: "15/01/2024",
        dataFim: "15/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Documentação completa e conforme."
      },
      {
        id: "2",
        etapa: "Digitalização de Documentos",
        responsavel: "Equipe de Digitalização",
        dataInicio: "16/01/2024",
        dataFim: "16/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Todos os documentos digitalizados e anexados ao sistema."
      },
      {
        id: "3",
        etapa: "Validação da Secretaria",
        responsavel: "Chefe de Secretaria",
        dataInicio: "17/01/2024",
        dataFim: "17/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo validado e conforme requisitos."
      },
      {
        id: "4",
        etapa: "Verificação Preliminar",
        responsavel: "Auditor Técnico",
        dataInicio: "18/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Em análise da documentação financeira."
      },
      {
        id: "5",
        etapa: "Análise Técnica",
        responsavel: "Chefe de Secção",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "6",
        etapa: "Aprovação Final",
        responsavel: "Diretor de Serviços",
        dataInicio: "",
        status: "Pendente" as const,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Processo {processo.numero}
            </h1>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {processo.status}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              {processo.prioridade}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {processo.tipo} - Exercício {processo.exercicio}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Entidade</p>
              <p className="font-semibold text-foreground">{processo.entidade}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-semibold text-foreground">{processo.responsavel}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Data Abertura</p>
              <p className="font-semibold text-foreground">{processo.dataAbertura}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className="font-semibold text-foreground">{processo.prazo}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="tramitacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tramitacao" className="font-bold">Tramitação</TabsTrigger>
          <TabsTrigger value="documentos" className="font-bold">Documentos</TabsTrigger>
          <TabsTrigger value="acoes" className="font-bold">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="tramitacao">
          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Etapa Atual</p>
                  <p className="text-lg font-bold text-primary">{processo.etapaAtual}</p>
                </div>
              </div>
            </Card>

            <TramitacaoTimeline tramitacao={processo.tramitacao} />
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <ProcessDocuments />
        </TabsContent>

        <TabsContent value="acoes">
          <AcaoProcesso 
            processoId={processo.numero}
            etapaAtual={processo.etapaAtual}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
