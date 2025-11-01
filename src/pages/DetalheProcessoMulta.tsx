import { ArrowLeft, FileText, Clock, User, Building, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TramitacaoTimeline } from "@/components/processo/TramitacaoTimeline";
import { AcaoProcesso } from "@/components/processo/AcaoProcesso";
import { ProcessDocuments } from "@/components/processes/ProcessDocuments";

interface DetalheProcessoMultaProps {
  onBack: () => void;
}

export const DetalheProcessoMulta = ({ onBack }: DetalheProcessoMultaProps) => {
  const processo = {
    numero: "PM/2024/001",
    tipo: "Processo de Multa",
    entidade: "Empresa Municipal X",
    infracoes: "Irregularidades Contabilísticas",
    valorMulta: "5.000.000 Kz",
    responsavel: "Dr. Carlos Mendes",
    status: "Notificado",
    prioridade: "Alta",
    dataAbertura: "05/01/2024",
    prazo: "30 dias para pagamento",
    etapaAtual: "Prazo para Defesa",
    tramitacao: [
      {
        id: "1",
        etapa: "Instauração do Processo",
        responsavel: "Diretor de Fiscalização",
        dataInicio: "05/01/2024",
        dataFim: "05/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo instaurado com base no relatório de fiscalização."
      },
      {
        id: "2",
        etapa: "Quantificação da Multa",
        responsavel: "Assessor Jurídico",
        dataInicio: "06/01/2024",
        dataFim: "08/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Valor da multa calculado conforme legislação aplicável."
      },
      {
        id: "3",
        etapa: "Notificação da Entidade",
        responsavel: "Secretaria",
        dataInicio: "09/01/2024",
        dataFim: "10/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Entidade notificada com prazo para defesa e pagamento."
      },
      {
        id: "4",
        etapa: "Prazo para Defesa",
        responsavel: "Entidade Autuada",
        dataInicio: "11/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Aguardando manifestação da entidade (prazo: 15 dias)."
      },
      {
        id: "5",
        etapa: "Análise da Defesa",
        responsavel: "Comissão de Julgamento",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "6",
        etapa: "Decisão Final",
        responsavel: "Diretor Geral",
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
            <Badge variant="secondary" className="bg-warning text-warning-foreground">
              {processo.status}
            </Badge>
            <Badge variant="outline" className="border-destructive text-destructive">
              {processo.prioridade}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {processo.tipo} - {processo.infracoes}
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

        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Valor da Multa</p>
              <p className="font-semibold text-destructive">{processo.valorMulta}</p>
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

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className="font-semibold text-foreground">{processo.prazo}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-warning/10 border-warning">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-foreground mb-1">Infrações Identificadas</p>
            <p className="text-sm text-muted-foreground">{processo.infracoes}</p>
          </div>
        </div>
      </Card>

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
