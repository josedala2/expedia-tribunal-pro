import { ArrowLeft, FileText, Clock, User, Building, DollarSign, AlertCircle, CalendarDays, CheckCircle, History, Info, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TramitacaoTimeline } from "@/components/processo/TramitacaoTimeline";
import { AcaoProcesso } from "@/components/processo/AcaoProcesso";
import { ProcessDocuments } from "@/components/processes/ProcessDocuments";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    nif: "5000000000",
    morada: "Rua Ho Chi Minh, Luanda",
    telefone: "+244 222 000 000",
    email: "contabilidade@med.gov.ao",
    status: "Em Análise",
    prioridade: "Normal",
    dataAbertura: "15/01/2024",
    dataRecepcao: "10/01/2024",
    prazo: "30 de junho de 2024",
    prazoLegal: "90 dias úteis",
    diasDecorridos: 45,
    diasRestantes: 45,
    naturezaEntidade: "Administração Central",
    classificacaoRisco: "Baixo",
    orcamentoAnual: "15.450.000.000,00 AOA",
    valorEmolumentos: "350.000,00 AOA",
    statusEmolumentos: "Não Aplicável",
    divisao: "3ª Divisão",
    seccao: "Secção de Fiscalização Sucessiva",
    juizRelator: "Dr. Manuel Costa",
    juizAdjunto: "Dra. Sofia Martins",
    coordenadorTecnico: "Carlos Neto",
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

  const historico = [
    {
      id: "1",
      tipo: "Status",
      acao: "Processo criado",
      usuario: "Sistema",
      data: "10/01/2024 09:00",
      detalhes: "Processo de prestação de contas registado no sistema"
    },
    {
      id: "2",
      tipo: "Atribuição",
      acao: "Juiz Relator atribuído",
      usuario: "Sistema de Sorteio",
      data: "19/01/2024 10:30",
      detalhes: "Dr. Manuel Costa - sorteio automático"
    },
    {
      id: "3",
      tipo: "Tramitação",
      acao: "Enviado para análise técnica",
      usuario: "Chefe de Secção",
      data: "24/01/2024 08:15",
      detalhes: "Processo distribuído à equipa técnica 1"
    },
    {
      id: "4",
      tipo: "Documento",
      acao: "Documento anexado",
      usuario: "Ana Costa",
      data: "16/03/2024 15:30",
      detalhes: "Parecer Técnico Preliminar.docx"
    },
  ];

  const observacoes = [
    {
      id: "1",
      titulo: "Documentação Completa",
      conteudo: "A entidade apresentou toda a documentação necessária conforme lista de verificação. Não há necessidade de diligências iniciais.",
      autor: "Carlos Neto",
      data: "24/01/2024 14:30",
      tipo: "info"
    },
    {
      id: "2",
      titulo: "Prazo Legal",
      conteudo: "Processo dentro do prazo legal de 90 dias úteis. Atenção especial à data limite de 30 de junho.",
      autor: "Sistema",
      data: "15/01/2024 09:00",
      tipo: "warning"
    },
  ];

  const handleDownloadProcesso = () => {
    toast.success("A preparar download do processo completo...");
  };

  const handleEditarProcesso = () => {
    toast.info("Funcionalidade de edição será implementada");
  };

  const getPrazoColor = (dias: number) => {
    if (dias <= 10) return "text-destructive";
    if (dias <= 30) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-foreground">
              Processo {processo.numero}
            </h1>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {processo.status}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              {processo.prioridade}
            </Badge>
            <Badge variant="outline" className="border-muted">
              Risco: {processo.classificacaoRisco}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {processo.tipo} - Exercício {processo.exercicio}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadProcesso}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleEditarProcesso}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Entidade</p>
              <p className="font-semibold text-foreground truncate">{processo.entidade}</p>
              <p className="text-xs text-muted-foreground">{processo.naturezaEntidade}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className={`font-semibold ${getPrazoColor(processo.diasRestantes)}`}>
                {processo.diasRestantes} dias restantes
              </p>
              <p className="text-xs text-muted-foreground">{processo.prazoLegal}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Orçamento Anual</p>
              <p className="font-semibold text-foreground text-xs">{processo.orcamentoAnual}</p>
              <p className="text-xs text-muted-foreground">Ano {processo.exercicio}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Emolumentos</p>
              <p className="font-semibold text-foreground text-xs">{processo.valorEmolumentos}</p>
              <p className="text-xs text-muted-foreground">{processo.statusEmolumentos}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Informações da Entidade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Informações da Entidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nome da Entidade</p>
              <p className="font-semibold text-foreground">{processo.entidade}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">NIF</p>
              <p className="font-semibold text-foreground">{processo.nif}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Natureza</p>
              <p className="font-semibold text-foreground">{processo.naturezaEntidade}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Telefone</p>
              <p className="font-semibold text-foreground">{processo.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold text-foreground">{processo.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Morada</p>
              <p className="font-semibold text-foreground">{processo.morada}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsáveis pelo Processo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Juiz Relator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{processo.juizRelator}</p>
                <p className="text-xs text-muted-foreground">Magistrado Coordenador</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Juiz Adjunto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{processo.juizAdjunto}</p>
                <p className="text-xs text-muted-foreground">Magistrado Adjunto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Coordenador Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <User className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{processo.coordenadorTecnico}</p>
                <p className="text-xs text-muted-foreground">{processo.seccao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Datas e Prazos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Datas e Prazos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Data de Recepção</p>
              <p className="font-semibold text-foreground">{processo.dataRecepcao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Data de Abertura</p>
              <p className="font-semibold text-foreground">{processo.dataAbertura}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Prazo Legal</p>
              <p className="font-semibold text-foreground">{processo.prazoLegal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Data Limite</p>
              <p className="font-semibold text-foreground">{processo.prazo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dias Decorridos</p>
              <Badge variant="secondary" className="bg-primary text-white">
                {processo.diasDecorridos} dias
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dias Restantes</p>
              <Badge variant="secondary" className={
                processo.diasRestantes <= 10 ? "bg-destructive text-white" :
                processo.diasRestantes <= 30 ? "bg-warning text-white" :
                "bg-success text-white"
              }>
                {processo.diasRestantes} dias
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Divisão</p>
              <p className="font-semibold text-foreground">{processo.divisao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Secção</p>
              <p className="font-semibold text-foreground text-xs">{processo.seccao}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="tramitacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tramitacao" className="font-semibold">
            <FileText className="h-4 w-4 mr-2" />
            Tramitação
          </TabsTrigger>
          <TabsTrigger value="documentos" className="font-semibold">
            <FileText className="h-4 w-4 mr-2" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="historico" className="font-semibold">
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="observacoes" className="font-semibold">
            <Info className="h-4 w-4 mr-2" />
            Observações
          </TabsTrigger>
          <TabsTrigger value="acoes" className="font-semibold">
            <CheckCircle className="h-4 w-4 mr-2" />
            Acções
          </TabsTrigger>
        </TabsList>

        {/* Tab de Tramitação */}
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

        {/* Tab de Documentos */}
        <TabsContent value="documentos">
          <ProcessDocuments processoNumero={processo.numero} />
        </TabsContent>

        {/* Tab de Histórico */}
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico de Mudanças
              </CardTitle>
              <CardDescription>
                Registo completo de todas as acções realizadas no processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {historico.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            item.tipo === "Status" ? "bg-primary/10" :
                            item.tipo === "Atribuição" ? "bg-accent/10" :
                            item.tipo === "Tramitação" ? "bg-success/10" :
                            "bg-muted"
                          }`}>
                            {item.tipo === "Status" && <AlertCircle className="h-5 w-5 text-primary" />}
                            {item.tipo === "Atribuição" && <User className="h-5 w-5 text-accent" />}
                            {item.tipo === "Tramitação" && <FileText className="h-5 w-5 text-success" />}
                            {item.tipo === "Documento" && <FileText className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          {index < historico.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="bg-card border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {item.tipo}
                                  </Badge>
                                  <h4 className="font-semibold text-foreground">{item.acao}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.detalhes}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {item.usuario}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.data}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Observações */}
        <TabsContent value="observacoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Observações e Notas
              </CardTitle>
              <CardDescription>
                Notas importantes sobre o processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {observacoes.map((obs) => (
                  <Card key={obs.id} className={
                    obs.tipo === "warning" ? "border-warning bg-warning/5" :
                    obs.tipo === "info" ? "border-primary bg-primary/5" :
                    "border-border"
                  }>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {obs.tipo === "warning" && <AlertCircle className="h-5 w-5 text-warning" />}
                          {obs.tipo === "info" && <Info className="h-5 w-5 text-primary" />}
                          <CardTitle className="text-base">{obs.titulo}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {obs.tipo === "warning" ? "Atenção" : "Informação"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {obs.conteudo}
                      </p>
                      <Separator className="my-3" />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {obs.autor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {obs.data}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Adicionar Observação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Ações */}
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
