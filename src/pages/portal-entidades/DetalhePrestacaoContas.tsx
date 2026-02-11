import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, Loader2, Clock, CheckCircle, XCircle, Building, DollarSign, FileCheck, File, Download } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

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

interface Props {
  processo: any;
  onBack: () => void;
}

export function DetalhePrestacaoContas({ processo, onBack }: Props) {
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

  // Show only: completed steps, current step (Em Andamento), and next pending step
  const currentIndex = tramitacao.findIndex(t => t.status === "Em Andamento");
  const firstPendingIndex = tramitacao.findIndex(t => t.status === "Pendente");
  const activeIndex = currentIndex >= 0 ? currentIndex : firstPendingIndex;
  const nextIndex = activeIndex >= 0 ? activeIndex + 1 : -1;

  const visibleSteps = tramitacao.filter((step, index) => {
    if (step.status === "Concluído") return true;
    if (index === activeIndex) return true;
    if (index === nextIndex) return true;
    return false;
  });

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
                    {visibleSteps.map((step, idx) => {
                      const stepOriginalIndex = tramitacao.indexOf(step);
                      return (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.status === "Concluído"
                                ? "bg-green-500 text-white"
                                : step.status === "Em Andamento"
                                ? "bg-primary text-primary-foreground animate-pulse"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {step.status === "Concluído" ? <CheckCircle className="h-4 w-4" /> : stepOriginalIndex + 1}
                            </div>
                            {idx < visibleSteps.length - 1 && (
                              <div className={`w-0.5 h-8 ${
                                step.status === "Concluído" ? "bg-green-300" : "bg-muted"
                              }`} />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className={`font-medium text-sm ${
                              step.status === "Concluído" ? "text-green-700" :
                              step.status === "Em Andamento" ? "text-primary font-bold" :
                              "text-muted-foreground"
                            }`}>
                              {step.etapa}
                            </p>
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  Documentos do Processo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentosLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documentos.length > 0 && documentos.map((doc: any, idx: number) => (
                      <div key={`sub-${idx}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {doc.etiqueta || doc.nome || `Documento ${idx + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.nome || "Documento"}
                              {doc.tamanho ? ` • ${(doc.tamanho / 1024).toFixed(0)} KB` : ""}
                              <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1">Submetido</Badge>
                            </p>
                          </div>
                        </div>
                        {doc.url ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" disabled title="Documento indisponível">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    {processo.numero_acta && (
                      <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50/50 hover:bg-green-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-green-800">Acta de Recepção</p>
                            <p className="text-xs text-muted-foreground">
                              Nº {processo.numero_acta}
                              <Badge className="ml-2 bg-green-100 text-green-700 text-[10px] py-0 px-1">Gerado</Badge>
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Gerada</Badge>
                      </div>
                    )}

                    {documentos.length === 0 && !processo.numero_acta && (
                      <div className="py-8 text-center text-muted-foreground">
                        <File className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Nenhum documento associado a este processo</p>
                      </div>
                    )}
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
