import { ArrowLeft, FileText, Clock, User, Building, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TramitacaoTimeline } from "@/components/processo/TramitacaoTimeline";
import { AcaoProcesso } from "@/components/processo/AcaoProcesso";
import { ProcessDocuments } from "@/components/processes/ProcessDocuments";

interface DetalheFiscalizacaoProps {
  onBack: () => void;
}

export const DetalheFiscalizacao = ({ onBack }: DetalheFiscalizacaoProps) => {
  const processo = {
    numero: "FOGE/2024/001",
    tipo: "Fiscalização da Execução do OGE",
    orgao: "Ministério da Saúde",
    programa: "Programa Nacional de Saúde",
    auditor: "Dr. João Silva",
    status: "Em Fiscalização",
    prioridade: "Normal",
    dataAbertura: "10/01/2024",
    prazo: "60 dias",
    etapaAtual: "Trabalho de Campo",
    tramitacao: [
      {
        id: "1",
        etapa: "Planeamento da Fiscalização",
        responsavel: "Equipe de Planeamento",
        dataInicio: "10/01/2024",
        dataFim: "15/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Plano de fiscalização aprovado com escopo definido."
      },
      {
        id: "2",
        etapa: "Notificação ao Órgão",
        responsavel: "Secretaria",
        dataInicio: "16/01/2024",
        dataFim: "17/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Órgão notificado e documentação solicitada."
      },
      {
        id: "3",
        etapa: "Trabalho de Campo",
        responsavel: "Equipe de Auditoria",
        dataInicio: "20/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Auditoria em execução no Ministério da Saúde."
      },
      {
        id: "4",
        etapa: "Relatório Preliminar",
        responsavel: "Auditor Chefe",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "5",
        etapa: "Contraditório",
        responsavel: "Órgão Fiscalizado",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "6",
        etapa: "Relatório Final",
        responsavel: "Diretor de Fiscalização",
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
              Fiscalização {processo.numero}
            </h1>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {processo.status}
            </Badge>
            <Badge variant="outline" className="border-accent text-accent">
              {processo.prioridade}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {processo.programa}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Órgão</p>
              <p className="font-semibold text-foreground">{processo.orgao}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Auditor</p>
              <p className="font-semibold text-foreground">{processo.auditor}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Data Início</p>
              <p className="font-semibold text-foreground">{processo.dataAbertura}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <FileBarChart className="h-8 w-8 text-warning" />
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
