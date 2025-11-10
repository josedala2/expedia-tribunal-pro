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
    natureza: "Visto Normal",
    entidade: "Ministério das Finanças",
    entidadeContratada: "Empresa ABC, Lda",
    valor: "150.000.000 Kz",
    objeto: "Aquisição de Equipamentos Informáticos",
    fonteFinanciamento: "Orçamento Geral do Estado",
    responsavel: "Escrivão João Silva",
    juizRelator: "Dra. Maria Santos (Letra A)",
    juizAdjunto: "Dr. Carlos Mendes (Letra B)",
    status: "Em Análise Técnica",
    prioridade: "Normal",
    prazoVisto: "30 dias",
    dataAbertura: "15/01/2024",
    dataVistoTacito: "14/02/2024",
    divisao: "1ª Divisão",
    seccao: "Secção de Fiscalização Preventiva",
    etapaAtual: "Verificação Preliminar",
    tramitacao: [
      {
        id: "1",
        etapa: "Registo de Entrada",
        responsavel: "Técnico da SG - Ana Costa",
        dataInicio: "15/01/2024",
        dataFim: "15/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Expediente registado no sistema. Acta de recebimento emitida ao remetente."
      },
      {
        id: "2",
        etapa: "Digitalização",
        responsavel: "Equipe de Digitalização - SG",
        dataInicio: "16/01/2024",
        dataFim: "16/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Todos os documentos digitalizados e anexados ao sistema."
      },
      {
        id: "3",
        etapa: "Validação da Secretaria",
        responsavel: "Chefe da SG - Pedro Alves",
        dataInicio: "17/01/2024",
        dataFim: "17/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Expediente validado e em conformidade. Remetido à Contadoria Geral."
      },
      {
        id: "4",
        etapa: "Verificação de Documento",
        responsavel: "Técnico da CG - Rita Fernandes",
        dataInicio: "18/01/2024",
        dataFim: "18/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Check List verificada. Todos os documentos necessários presentes."
      },
      {
        id: "5",
        etapa: "Registo e Autuação do Processo",
        responsavel: "Escrivão dos Autos - João Silva",
        dataInicio: "19/01/2024",
        dataFim: "19/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo registado com nº PV/2024/001. Juiz Relator (Letra A) e Adjunto (Letra B) atribuídos automaticamente. Divisão: 1ª Divisão. Capa do processo gerada."
      },
      {
        id: "6",
        etapa: "Divisão Competente",
        responsavel: "Chefe de Divisão - Eng. Miguel Sousa",
        dataInicio: "20/01/2024",
        dataFim: "20/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo recebido e encaminhado à Secção de Fiscalização Preventiva."
      },
      {
        id: "7",
        etapa: "Secção Competente",
        responsavel: "Chefe de Secção - Dra. Paula Santos",
        dataInicio: "21/01/2024",
        dataFim: "21/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo distribuído à equipe técnica. Coordenador: Técnico Jurista Carlos Neto."
      },
      {
        id: "8",
        etapa: "Verificação Preliminar",
        responsavel: "Equipe Técnica (Coordenador: Carlos Neto)",
        dataInicio: "22/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Análise preliminar em curso. Verificação da conformidade legal e técnica do contrato."
      },
      {
        id: "9",
        etapa: "Validação do Chefe de Secção",
        responsavel: "Chefe de Secção - Dra. Paula Santos",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "10",
        etapa: "Validação do Chefe de Divisão",
        responsavel: "Chefe de Divisão - Eng. Miguel Sousa",
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
        responsavel: "Juiz Relator - Dra. Maria Santos",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "13",
        etapa: "Cobrança de Emolumentos",
        responsavel: "CG-SCE - Secção de Custas e Emolumentos",
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
        etapa: "Saída de Expediente",
        responsavel: "DST - Dr. António Lima",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Entidade Contratante</p>
              <p className="font-semibold text-foreground text-sm">{processo.entidade}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Valor do Contrato</p>
              <p className="font-semibold text-foreground">{processo.valor}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Juiz Relator</p>
              <p className="font-semibold text-foreground text-sm">{processo.juizRelator}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Visto Tácito</p>
              <p className="font-semibold text-foreground">{processo.dataVistoTacito}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Objeto:</span>
              <span className="text-sm font-medium text-foreground">{processo.objeto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Natureza:</span>
              <Badge variant="outline" className="border-primary text-primary">{processo.natureza}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Divisão:</span>
              <span className="text-sm font-medium text-foreground">{processo.divisao}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Secção:</span>
              <span className="text-sm font-medium text-foreground text-right">{processo.seccao}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Juiz Adjunto:</span>
              <span className="text-sm font-medium text-foreground">{processo.juizAdjunto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Prazo:</span>
              <span className="text-sm font-medium text-foreground">{processo.prazoVisto}</span>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="tramitacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tramitacao" className="font-bold">Tramitação</TabsTrigger>
          <TabsTrigger value="documentos" className="font-bold">Documentos</TabsTrigger>
          <TabsTrigger value="acoes" className="font-bold">Acções</TabsTrigger>
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
