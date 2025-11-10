import { ArrowLeft, FileText, Clock, User, Building, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TramitacaoTimeline } from "@/components/processo/TramitacaoTimeline";
import { AcaoProcesso } from "@/components/processo/AcaoProcesso";
import { ProcessDocuments } from "@/components/processes/ProcessDocuments";

interface DetalheExpedienteProps {
  onBack: () => void;
}

export const DetalheExpediente = ({ onBack }: DetalheExpedienteProps) => {
  const expediente = {
    numero: "EXP/2024/001",
    tipo: "Ofício",
    natureza: "Externa",
    assunto: "Solicitação de Informações Orçamentárias",
    origem: "Ministério das Finanças",
    destino: "Tribunal de Contas",
    entidadeExterna: "Ministério das Finanças",
    emailExterno: "geral@minfinancas.gov.ao",
    telefoneExterno: "+244 222 123 456",
    prioridade: "Alta",
    status: "Em Tramitação",
    dataEntrada: "20/01/2024",
    prazo: "15 dias úteis",
    etapaAtual: "Análise Técnica",
    tramitacao: [
      {
        id: "1",
        etapa: "Registo de Entrada",
        responsavel: "Secretaria Geral - Maria Costa",
        dataInicio: "20/01/2024",
        dataFim: "20/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Expediente registado no Livro de Correspondência. Documentação completa."
      },
      {
        id: "2",
        etapa: "Digitalização de Documentos",
        responsavel: "Equipe de Digitalização - João Silva",
        dataInicio: "20/01/2024",
        dataFim: "20/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Todos os documentos digitalizados e anexados ao sistema."
      },
      {
        id: "3",
        etapa: "Validação da Secretaria",
        responsavel: "Chefe de Secretaria - Ana Santos",
        dataInicio: "21/01/2024",
        dataFim: "21/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Expediente validado. Encaminhado para o Gabinete do Presidente."
      },
      {
        id: "4",
        etapa: "Despacho do Presidente",
        responsavel: "Gabinete do Presidente",
        dataInicio: "22/01/2024",
        dataFim: "22/01/2024",
        status: "Concluído" as const,
        decisao: "Aprovado" as const,
        observacoes: "Despachado para a Direção de Serviços Administrativos para análise técnica."
      },
      {
        id: "5",
        etapa: "Análise Técnica",
        responsavel: "DSA - Carlos Mendes",
        dataInicio: "23/01/2024",
        status: "Em Andamento" as const,
        observacoes: "Em análise da solicitação de informações."
      },
      {
        id: "6",
        etapa: "Preparação de Resposta",
        responsavel: "Técnico Responsável",
        dataInicio: "",
        status: "Pendente" as const,
      },
      {
        id: "7",
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
              Expediente {expediente.numero}
            </h1>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {expediente.status}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              {expediente.prioridade}
            </Badge>
            <Badge variant="outline" className="border-success text-success">
              {expediente.natureza}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {expediente.tipo} - {expediente.assunto}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Origem</p>
              <p className="font-semibold text-foreground">{expediente.origem}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Destino</p>
              <p className="font-semibold text-foreground">{expediente.destino}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold text-foreground text-xs">{expediente.emailExterno}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <Phone className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-semibold text-foreground text-xs">{expediente.telefoneExterno}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Data de Entrada</p>
              <p className="font-semibold text-foreground">{expediente.dataEntrada}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Prazo de Resposta</p>
              <p className="font-semibold text-foreground">{expediente.prazo}</p>
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
                  <p className="text-lg font-bold text-primary">{expediente.etapaAtual}</p>
                </div>
              </div>
            </Card>

            <TramitacaoTimeline tramitacao={expediente.tramitacao} />
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <ProcessDocuments />
        </TabsContent>

        <TabsContent value="acoes">
          <AcaoProcesso 
            processoId={expediente.numero}
            etapaAtual={expediente.etapaAtual}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
