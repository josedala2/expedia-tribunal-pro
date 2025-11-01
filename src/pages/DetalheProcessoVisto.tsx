import { ArrowLeft, FileText, Clock, User, Building, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TramitacaoTimeline } from "@/components/processo/TramitacaoTimeline";
import { AcaoProcesso } from "@/components/processo/AcaoProcesso";
import { ProcessDocuments } from "@/components/processes/ProcessDocuments";

interface DetalheProcessoVistoProps {
  onBack: () => void;
}

export const DetalheProcessoVisto = ({ onBack }: DetalheProcessoVistoProps) => {
  const processo = {
    numero: "PV/2024/001",
    tipo: "Visto Prévio",
    entidade: "Ministério das Finanças",
    valor: "150.000.000 Kz",
    responsavel: "Dr. Manuel Costa",
    status: "Em Análise",
    prioridade: "Alta",
    dataAbertura: "20/01/2024",
    prazo: "15 dias",
    etapaAtual: "Análise Técnica",
    tramitacao: [
      {
        id: "1",
        etapa: "Registo do Pedido",
        responsavel: "Secretaria de Visto",
        dataInicio: "20/01/2024",
        dataFim: "20/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Pedido registado com todos os documentos anexados."
      },
      {
        id: "2",
        etapa: "Verificação de Conformidade Legal",
        responsavel: "Assessor Jurídico",
        dataInicio: "21/01/2024",
        dataFim: "22/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Pedido em conformidade com a legislação aplicável."
      },
      {
        id: "3",
        etapa: "Análise Técnica",
        responsavel: "Técnico Superior",
        dataInicio: "23/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Verificação da documentação técnica e financeira."
      },
      {
        id: "4",
        etapa: "Parecer do Chefe de Secção",
        responsavel: "Chefe de Secção",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "5",
        etapa: "Decisão Final",
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
            <Badge variant="outline" className="border-destructive text-destructive">
              {processo.prioridade}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {processo.tipo}
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

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="font-semibold text-foreground">{processo.valor}</p>
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
