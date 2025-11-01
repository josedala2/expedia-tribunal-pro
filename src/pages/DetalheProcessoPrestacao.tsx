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
    prazo: "30 de junho de 2024",
    naturezaEntidade: "Administração Central",
    divisao: "3ª Divisão",
    seccao: "Secção de Fiscalização Sucessiva",
    juizRelator: "Dr. Manuel Costa",
    juizAdjunto: "Dra. Sofia Martins",
    etapaAtual: "Análise Técnica",
    tramitacao: [
      {
        id: "1",
        etapa: "Registo de Entrada",
        responsavel: "Técnico da Secretaria Geral",
        dataInicio: "15/01/2024",
        dataFim: "15/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Expediente registado com sucesso. Acta de recebimento emitida."
      },
      {
        id: "2",
        etapa: "Digitalização",
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
        observacoes: "Documentação completa e conforme requisitos legais."
      },
      {
        id: "4",
        etapa: "Verificação de Documento",
        responsavel: "Técnico da CG",
        dataInicio: "18/01/2024",
        dataFim: "18/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Documentos verificados e conformes."
      },
      {
        id: "5",
        etapa: "Registo e Autuação do Processo",
        responsavel: "Técnico da Contadoria Geral",
        dataInicio: "19/01/2024",
        dataFim: "19/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo autuado. Juiz Relator e Juiz Adjunto atribuídos por sorteio."
      },
      {
        id: "6",
        etapa: "Distribuição à Divisão",
        responsavel: "Chefe da 3ª Divisão - Eng. Miguel Sousa",
        dataInicio: "22/01/2024",
        dataFim: "22/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo distribuído conforme natureza da entidade."
      },
      {
        id: "7",
        etapa: "Distribuição à Secção",
        responsavel: "Chefe de Secção - Carlos Neto",
        dataInicio: "23/01/2024",
        dataFim: "23/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo distribuído à equipa técnica."
      },
      {
        id: "8",
        etapa: "Análise Técnica",
        responsavel: "Coordenador: Carlos Neto | Equipa Técnica 1",
        dataInicio: "24/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Em análise das demonstrações numéricas e documentação financeira."
      },
      {
        id: "9",
        etapa: "Validação do Chefe de Secção",
        responsavel: "Chefe de Secção",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "10",
        etapa: "Validação do Chefe de Divisão",
        responsavel: "Chefe de Divisão",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "11",
        etapa: "Controle de Qualidade",
        responsavel: "DST - Dr. António Lima",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "12",
        etapa: "Decisão",
        responsavel: "Juiz Relator e Juiz Adjunto",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "13",
        etapa: "Cobrança de Emolumentos",
        responsavel: "CG - Secção de Cobrança",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "14",
        etapa: "Despacho Promoção",
        responsavel: "Ministério Público",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "15",
        etapa: "Cumprimento de Despachos",
        responsavel: "CG - Secção de Fiscalização Preventiva",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "16",
        etapa: "Ofício Remessa",
        responsavel: "DST",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "17",
        etapa: "Expediente de Saída",
        responsavel: "Oficial de Diligências",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Entidade</p>
              <p className="font-semibold text-foreground">{processo.entidade}</p>
              <p className="text-xs text-muted-foreground">{processo.naturezaEntidade}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-semibold text-foreground">{processo.responsavel}</p>
              <p className="text-xs text-muted-foreground">Exercício {processo.exercicio}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Prazo Submissão</p>
              <p className="font-semibold text-foreground">{processo.prazo}</p>
              <p className="text-xs text-muted-foreground">Aberto: {processo.dataAbertura}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Divisão/Secção</p>
              <p className="font-semibold text-foreground text-xs">{processo.divisao}</p>
              <p className="text-xs text-muted-foreground">{processo.seccao}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Juiz Relator</p>
            <p className="text-lg font-bold text-foreground">{processo.juizRelator}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Juiz Adjunto</p>
            <p className="text-lg font-bold text-foreground">{processo.juizAdjunto}</p>
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
