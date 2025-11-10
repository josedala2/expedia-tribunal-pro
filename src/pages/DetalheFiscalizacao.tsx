import { ArrowLeft, FileText, Clock, User, Building, Calendar } from "lucide-react";
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
    periodo: "1º Trimestre 2024",
    periodoReferencia: "Janeiro a Março de 2024",
    entidade: "Ministério das Finanças",
    remetente: "Ministério das Finanças",
    responsavel: "Ministro das Finanças - Dr. Vera Daves",
    gestoresObservacao: ["Dr. João Silva - Diretor Nacional", "Dra. Ana Costa - Chefe de Departamento"],
    status: "Em Análise Técnica",
    prioridade: "Alta",
    dataRecebimento: "15/04/2024",
    prazoAnalise: "45 dias úteis",
    prazoEmissaoParecer: "60 dias após recebimento",
    juizRelator: "Dr. Manuel Costa",
    juizAdjunto: "Dra. Sofia Martins",
    presidenteCamara: "Dr. Carlos Mendes",
    divisaoCompetente: "3ª Divisão - Fiscalização OGE",
    etapaAtual: "Parecer Competente",
    tramitacao: [
      {
        id: "1",
        etapa: "Registo de Entrada",
        responsavel: "Técnico da Secretaria Geral",
        dataInicio: "15/04/2024",
        dataFim: "15/04/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Relatório Trimestral recebido do MINFIN. Acta de recebimento emitida."
      },
      {
        id: "2",
        etapa: "Registo e Autuação do Processo",
        responsavel: "Contadoria Geral",
        dataInicio: "16/04/2024",
        dataFim: "16/04/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Processo autuado com número FOGE/2024/001. Documentação completa anexada."
      },
      {
        id: "3",
        etapa: "Distribuição Automática",
        responsavel: "Sistema (Automático)",
        dataInicio: "16/04/2024",
        dataFim: "16/04/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Juiz Relator e Juiz Adjunto atribuídos por sorteio. Presidente da 2ª Câmara notificado."
      },
      {
        id: "4",
        etapa: "Apreciação Inicial",
        responsavel: "Presidente da 2ª Câmara - Dr. Carlos Mendes",
        dataInicio: "17/04/2024",
        dataFim: "17/04/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Ordem emitida à 3ª Divisão para elaboração do parecer competente."
      },
      {
        id: "5",
        etapa: "Parecer Competente",
        responsavel: "Chefe da 3ª Divisão - Eng. Miguel Sousa",
        dataInicio: "18/04/2024",
        status: "Em Andamento" as const,
        observacoes: "Em análise do relatório de execução orçamental. Verificação de conformidade com normas orçamentais em curso."
      },
      {
        id: "6",
        etapa: "Controle de Qualidade",
        responsavel: "DST - Dr. António Lima",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "7",
        etapa: "Análise e Despacho",
        responsavel: "Juiz Relator e Juiz Adjunto",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "8",
        etapa: "Exercício de Contraditório",
        responsavel: "MinFin / Gestores Observados",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "9",
        etapa: "Justificação sobre Contraditório",
        responsavel: "Equipa da 3ª Divisão",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "10",
        etapa: "Elaboração da Resolução",
        responsavel: "Juiz Relator e Juiz Adjunto",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "11",
        etapa: "Apreciação pela Câmara",
        responsavel: "2ª Câmara (se necessário)",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "12",
        etapa: "Vista ao Ministério Público",
        responsavel: "Ministério Público",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "13",
        etapa: "Ofício de Remessa",
        responsavel: "DST - Dr. António Lima",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "14",
        etapa: "Notificação aos Gestores",
        responsavel: "Oficial de Diligências",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "15",
        etapa: "Comunicação à Assembleia Nacional",
        responsavel: "Gabinete do Presidente do TC",
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
            {processo.tipo} - {processo.periodo}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Remetente</p>
              <p className="font-semibold text-foreground text-xs">{processo.remetente}</p>
              <p className="text-xs text-muted-foreground mt-1">{processo.responsavel}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Período</p>
              <p className="font-semibold text-foreground">{processo.periodo}</p>
              <p className="text-xs text-muted-foreground">{processo.periodoReferencia}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Recebido</p>
              <p className="font-semibold text-foreground">{processo.dataRecebimento}</p>
              <p className="text-xs text-muted-foreground">{processo.prazoAnalise}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Divisão</p>
              <p className="font-semibold text-foreground text-xs">{processo.divisaoCompetente}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Presidente da 2ª Câmara</p>
            <p className="text-base font-bold text-foreground">{processo.presidenteCamara}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Juiz Relator</p>
            <p className="text-base font-bold text-foreground">{processo.juizRelator}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Juiz Adjunto</p>
            <p className="text-base font-bold text-foreground">{processo.juizAdjunto}</p>
          </div>
        </Card>
      </div>

      {processo.gestoresObservacao && processo.gestoresObservacao.length > 0 && (
        <Card className="p-4 bg-warning/10 border-warning">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-warning-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Gestores em Observação
            </p>
            <ul className="space-y-1">
              {processo.gestoresObservacao.map((gestor, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-warning"></div>
                  {gestor}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

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
