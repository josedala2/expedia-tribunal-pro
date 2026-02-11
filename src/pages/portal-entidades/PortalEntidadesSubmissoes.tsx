import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, FileText, Loader2, Clock, CheckCircle, XCircle, Building, DollarSign, FileCheck, Calendar, Eye, Download, File } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { FormularioVistoEntidade } from "./FormularioVistoEntidade";

interface Props {
  entidadeId: string;
  entidadeNome: string;
  onBack: () => void;
  tipoFiltro?: "visto" | "prestacao";
}

const statusColors: Record<string, string> = {
  submetido: "bg-blue-100 text-blue-800",
  em_analise: "bg-amber-100 text-amber-800",
  aguarda_validacao_chefe: "bg-purple-100 text-purple-800",
  aceite: "bg-green-100 text-green-800",
  rejeitado: "bg-red-100 text-red-800",
  devolvido: "bg-orange-100 text-orange-800",
};

const statusBadgeColors: Record<string, string> = {
  submetido: "bg-blue-500 text-white",
  em_analise: "bg-amber-500 text-white",
  aguarda_validacao_chefe: "bg-purple-500 text-white",
  aceite: "bg-green-500 text-white",
  rejeitado: "bg-red-500 text-white",
  devolvido: "bg-orange-500 text-white",
};

const statusLabels: Record<string, string> = {
  submetido: "Submetido",
  em_analise: "Em Análise",
  aguarda_validacao_chefe: "Aguarda Validação Chefe",
  aceite: "Aceite",
  rejeitado: "Rejeitado",
  devolvido: "Devolvido",
};

const statusIcons: Record<string, React.ReactNode> = {
  submetido: <Clock className="h-3.5 w-3.5" />,
  em_analise: <Clock className="h-3.5 w-3.5" />,
  aceite: <CheckCircle className="h-3.5 w-3.5" />,
  rejeitado: <XCircle className="h-3.5 w-3.5" />,
  devolvido: <XCircle className="h-3.5 w-3.5" />,
};

function formatCurrency(val: number | null) {
  return val != null
    ? new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(val)
    : "-";
}

function DetalhePrestacaoContas({ processo, onBack }: { processo: any; onBack: () => void }) {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [documentosLoading, setDocumentosLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const loadSignedUrls = async () => {
      const docs = Array.isArray(processo.documentos) ? processo.documentos : [];
      if (docs.length === 0) {
        setDocumentos([]);
        return;
      }
      setDocumentosLoading(true);
      try {
        const hydrated = await Promise.all(
          docs.map(async (doc: any) => {
            if (!doc) return doc;
            if (doc.url) return doc;
            if (!doc.storage_path) return doc;
            const { data, error } = await supabase.storage
              .from("processo-documentos")
              .createSignedUrl(doc.storage_path, 3600);
            if (error) return doc;
            return { ...doc, url: data?.signedUrl };
          })
        );
        if (active) setDocumentos(hydrated.filter(Boolean));
      } finally {
        if (active) setDocumentosLoading(false);
      }
    };
    loadSignedUrls();
    return () => { active = false; };
  }, [processo.documentos]);

  const getTramitacao = () => {
    const steps = [
      { etapa: "Submissão pelo Portal", status: "Concluído" as const, data: processo.criado_em ? format(new Date(processo.criado_em), "dd/MM/yyyy", { locale: pt }) : "-" },
      { etapa: "Recepção pela Secretaria", status: processo.status === "submetido" ? "Pendente" as const : "Concluído" as const, data: processo.status !== "submetido" && processo.atualizado_em ? format(new Date(processo.atualizado_em), "dd/MM/yyyy", { locale: pt }) : "-" },
      { etapa: "Geração da Acta de Recepção", status: processo.numero_acta ? "Concluído" as const : "Pendente" as const, data: processo.numero_acta ? format(new Date(processo.atualizado_em), "dd/MM/yyyy", { locale: pt }) : "-" },
      { etapa: "Validação Chefe de Secretaria", status: processo.status === "aguarda_validacao_chefe" ? "Em Andamento" as const : (processo.status === "aceite" ? "Concluído" as const : "Pendente" as const), data: "-" },
      { etapa: "Registo e Autuação", status: "Pendente" as const, data: "-" },
      { etapa: "Análise de Contas", status: "Pendente" as const, data: "-" },
      { etapa: "Validação Chefe Divisão", status: "Pendente" as const, data: "-" },
      { etapa: "Controle de Qualidade", status: "Pendente" as const, data: "-" },
      { etapa: "Decisão", status: "Pendente" as const, data: "-" },
    ];
    return steps;
  };

  const tramitacao = getTramitacao();
  const etapaAtual = tramitacao.find(t => t.status === "Em Andamento")?.etapa || tramitacao.find(t => t.status === "Pendente")?.etapa || "Submissão";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                Processo {processo.numero_processo_interno || processo.numero_referencia}
              </h1>
              <Badge className={`${statusBadgeColors[processo.status] || "bg-muted"} gap-1`}>
                {statusIcons[processo.status]}
                {statusLabels[processo.status] || processo.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Prestação de Contas</p>
          </div>
        </div>

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Entidade</p>
                <p className="font-semibold text-foreground text-sm">{processo.entidade_contratante || "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Valor da Conta</p>
                <p className="font-semibold text-foreground">{formatCurrency(processo.valor_contrato)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-accent">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Nº Processo Interno</p>
                <p className="font-semibold text-foreground text-sm">{processo.numero_processo_interno || "Aguardando"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Submissão</p>
                <p className="font-semibold text-foreground">
                  {processo.criado_em ? format(new Date(processo.criado_em), "dd/MM/yyyy", { locale: pt }) : "-"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assunto</span>
                <p className="text-sm font-medium text-foreground mt-1 line-clamp-4">{processo.assunto || "-"}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">Referência</span>
                <Badge variant="outline" className="border-primary text-primary text-xs">{processo.numero_referencia}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição / Objecto</span>
                <p className="text-sm font-medium text-foreground mt-1 line-clamp-4">{processo.objeto || processo.descricao || "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fonte Financiamento</span>
                <span className="text-sm font-semibold text-foreground uppercase">{processo.fonte_financiamento || "-"}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">Data Referência</span>
                <span className="text-sm font-medium text-foreground">
                  {processo.data_contrato ? format(new Date(processo.data_contrato), "dd/MM/yyyy", { locale: pt }) : "-"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tramitacao" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tramitacao" className="font-bold">Tramitação</TabsTrigger>
            <TabsTrigger value="documentos" className="font-bold">Documentos</TabsTrigger>
            <TabsTrigger value="observacoes" className="font-bold">Observações</TabsTrigger>
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
                    <p className="text-lg font-bold text-primary">{etapaAtual}</p>
                  </div>
                </div>
              </Card>

              {processo.numero_acta && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Acta de Recepção Gerada</p>
                      <p className="text-sm text-green-600">Nº {processo.numero_acta}</p>
                    </div>
                  </div>
                </Card>
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-0">
                    {tramitacao.map((step, idx) => {
                      const isLast = idx === tramitacao.length - 1;
                      const statusColor =
                        step.status === "Concluído" ? "bg-green-500" :
                        step.status === "Em Andamento" ? "bg-primary animate-pulse" :
                        "bg-muted";
                      const textColor =
                        step.status === "Concluído" ? "text-foreground" :
                        step.status === "Em Andamento" ? "text-primary font-semibold" :
                        "text-muted-foreground";

                      return (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${statusColor} mt-1.5`} />
                            {!isLast && <div className="w-0.5 flex-1 bg-border my-1" />}
                          </div>
                          <div className={`pb-4 ${textColor}`}>
                            <p className="text-sm">{step.etapa}</p>
                            <p className="text-xs text-muted-foreground">{step.data}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                {documentosLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : documentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Nenhum documento anexado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documentos.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <File className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{doc.etiqueta || doc.nome}</p>
                            <p className="text-xs text-muted-foreground">{doc.nome}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">Submetido</Badge>
                        </div>
                        {doc.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="observacoes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {processo.observacoes || "Sem observações registadas."}
                </p>

                {processo.motivo_devolucao && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-semibold text-orange-800">Motivo de Devolução</p>
                    <p className="text-sm text-orange-700 mt-1">{processo.motivo_devolucao}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function PortalEntidadesSubmissoes({ entidadeId, entidadeNome, onBack, tipoFiltro }: Props) {
  const [submissoes, setSubmissoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);
  const isPrestacao = tipoFiltro === "prestacao";

  useEffect(() => {
    loadSubmissoes();
  }, []);

  const loadSubmissoes = async () => {
    setLoading(true);
    let query = supabase
      .from("submissoes_entidade")
      .select("*")
      .eq("entidade_id", entidadeId)
      .order("criado_em", { ascending: false });
    
    if (tipoFiltro === "prestacao") {
      query = query.eq("tipo_processo", "Prestação de Contas");
    } else if (tipoFiltro === "visto") {
      query = query.neq("tipo_processo", "Prestação de Contas");
    }
    
    const { data } = await query;
    setSubmissoes(data || []);
    setLoading(false);
  };

  if (showForm) {
    return (
      <FormularioVistoEntidade
        entidadeId={entidadeId}
        entidadeNome={entidadeNome}
        onBack={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          loadSubmissoes();
        }}
        defaultTipo={isPrestacao ? "prestacao_contas" : undefined}
      />
    );
  }

  if (selectedProcesso && isPrestacao) {
    return (
      <DetalhePrestacaoContas
        processo={selectedProcesso}
        onBack={() => setSelectedProcesso(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isPrestacao ? "Prestação de Contas" : "Processos de Visto"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isPrestacao 
                  ? "Submissões de prestação de contas ao Tribunal de Contas" 
                  : "Pedidos de visto submetidos ao Tribunal de Contas"}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> {isPrestacao ? "Submeter Prestação de Contas" : "Novo Pedido de Visto"}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissoes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma submissão encontrada</p>
              <p className="text-sm">
                {isPrestacao 
                  ? "Clique em \"Submeter Prestação de Contas\" para submeter um processo"
                  : "Clique em \"Novo Pedido de Visto\" para submeter um processo"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissoes.map((s) => (
              <Card
                key={s.id}
                className="hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => isPrestacao ? setSelectedProcesso(s) : undefined}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {s.numero_referencia}
                        </span>
                        <Badge className={statusColors[s.status] || ""}>
                          {statusLabels[s.status] || s.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{s.assunto}</h3>
                      <p className="text-sm text-muted-foreground">{s.tipo_processo}</p>
                      {s.numero_processo_interno && (
                        <p className="text-xs font-mono text-primary font-semibold">
                          Processo: {s.numero_processo_interno}
                        </p>
                      )}
                      {s.entidade_contratante && !isPrestacao && (
                        <p className="text-xs text-muted-foreground">
                          Contratante: {s.entidade_contratante} | Contratada: {s.entidade_contratada}
                        </p>
                      )}
                      {s.motivo_devolucao && (
                        <p className="text-sm text-orange-600 mt-1">
                          Motivo: {s.motivo_devolucao}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-muted-foreground">
                        {format(new Date(s.criado_em), "dd/MM/yyyy HH:mm", { locale: pt })}
                        {s.valor_contrato && (
                          <p className="font-medium text-foreground mt-1">
                            {formatCurrency(s.valor_contrato)}
                          </p>
                        )}
                      </div>
                      {isPrestacao && (
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedProcesso(s); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
