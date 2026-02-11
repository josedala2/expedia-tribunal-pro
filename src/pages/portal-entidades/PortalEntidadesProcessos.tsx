import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DocumentChecklist } from "@/components/ui/document-checklist";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, FileText, Filter, Clock, CheckCircle, XCircle, ArrowLeft, Building, Calendar, User, FileCheck, Pencil, Save, DollarSign, Eye, Download, File } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
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

const canEdit = (status: string) => status === "submetido";

const DOCUMENTOS_DISPONIVEIS = [
  "Ofício de Solicitação de Visto",
  "Minuta do Contrato",
  "Cabimento Orçamental",
  "Proposta de Adjudicação / Despacho de Adjudicação",
  "Programa de Concurso / Caderno de Encargos",
  "Documentos de Habilitação da Empresa",
  "Certidão Negativa de Dívidas Fiscais",
  "Declaração de Regularidade com Segurança Social",
] as const;

const DOCUMENTOS_OBRIGATORIOS = [
  "Ofício de Solicitação de Visto",
  "Minuta do Contrato",
  "Cabimento Orçamental",
] as const;

function DetalheProcesso({ processo, onBack, onUpdated }: { processo: any; onBack: () => void; onUpdated: (updated: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [assunto, setAssunto] = useState(processo.assunto || "");
  const [tipoVisto, setTipoVisto] = useState(processo.tipo_visto || "");
  const [naturezaVisto, setNaturezaVisto] = useState(processo.natureza_visto || "");
  const [entidadeContratada, setEntidadeContratada] = useState(processo.entidade_contratada || "");
  const [nifContratada, setNifContratada] = useState(processo.nif_contratada || "");
  const [objeto, setObjeto] = useState(processo.objeto || "");
  const [valorContrato, setValorContrato] = useState(processo.valor_contrato?.toString() || "");
  const [fonteFinanciamento, setFonteFinanciamento] = useState(processo.fonte_financiamento || "");
  const [dataContrato, setDataContrato] = useState(processo.data_contrato || "");
  const [observacoes, setObservacoes] = useState(processo.observacoes || "");

  const [documentos, setDocumentos] = useState<any[]>([]);
  const [documentosLoading, setDocumentosLoading] = useState(false);
  const [documentosFicheiros, setDocumentosFicheiros] = useState<Map<string, File>>(new Map());
  const [documentosUploading, setDocumentosUploading] = useState(false);

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

    return () => {
      active = false;
    };
  }, [processo.documentos]);

  const formatCurrency = (val: number | null) =>
    val != null ? new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(val) : "-";

  const handleUploadDocumentos = async () => {
    if (documentosFicheiros.size === 0) {
      toast.error("Seleccione pelo menos um documento para anexar.");
      return;
    }

    setDocumentosUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");

      const sanitizeFileName = (name: string) =>
        name
          .normalize("NFKD")
          .replace(/[^\w.\-]+/g, "_")
          .replace(/_+/g, "_")
          .slice(0, 120);

      const existingDocs = Array.isArray(processo.documentos) ? processo.documentos : [];
      const newDocs: any[] = [];

      for (const [etiqueta, file] of Array.from(documentosFicheiros.entries())) {
        const safeName = sanitizeFileName(file.name);
        const storagePath = `${session.user.id}/${processo.id}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("processo-documentos")
          .upload(storagePath, file, { contentType: file.type, upsert: false });

        if (uploadError) {
          toast.error("Erro ao anexar documento", {
            description: `Não foi possível anexar "${file.name}".`,
          });
          continue;
        }

        newDocs.push({
          etiqueta,
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          storage_path: storagePath,
        });
      }

      const merged = [...existingDocs, ...newDocs];

      const { data: updated, error } = await supabase
        .from("submissoes_entidade")
        .update({ documentos: merged })
        .eq("id", processo.id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Documentos anexados com sucesso");
      setDocumentosFicheiros(new Map());
      onUpdated(updated);
    } catch (e: any) {
      toast.error("Erro ao anexar documentos", {
        description: e?.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setDocumentosUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("submissoes_entidade")
      .update({
        assunto,
        tipo_visto: tipoVisto,
        natureza_visto: naturezaVisto,
        entidade_contratada: entidadeContratada,
        nif_contratada: nifContratada,
        objeto,
        valor_contrato: valorContrato ? parseFloat(valorContrato) : null,
        fonte_financiamento: fonteFinanciamento,
        data_contrato: dataContrato || null,
        observacoes,
      })
      .eq("id", processo.id)
      .select()
      .single();

    setSaving(false);
    if (error) {
      toast.error("Erro ao guardar alterações");
    } else {
      toast.success("Pedido atualizado com sucesso");
      setEditing(false);
      onUpdated(data);
    }
  };

  const handleCancel = () => {
    setAssunto(processo.assunto || "");
    setTipoVisto(processo.tipo_visto || "");
    setNaturezaVisto(processo.natureza_visto || "");
    setEntidadeContratada(processo.entidade_contratada || "");
    setNifContratada(processo.nif_contratada || "");
    setObjeto(processo.objeto || "");
    setValorContrato(processo.valor_contrato?.toString() || "");
    setFonteFinanciamento(processo.fonte_financiamento || "");
    setDataContrato(processo.data_contrato || "");
    setObservacoes(processo.observacoes || "");
    setEditing(false);
  };

  const editable = canEdit(processo.status);

  // Tramitação steps based on status
  const getTramitacao = () => {
    const steps = [
      { etapa: "Submissão pelo Portal", status: "Concluído" as const, data: processo.criado_em ? format(new Date(processo.criado_em), "dd/MM/yyyy", { locale: pt }) : "-" },
      { etapa: "Recepção pela Secretaria", status: processo.status === "submetido" ? "Pendente" as const : "Concluído" as const, data: processo.status !== "submetido" && processo.atualizado_em ? format(new Date(processo.atualizado_em), "dd/MM/yyyy", { locale: pt }) : "-" },
      { etapa: "Geração da Acta de Recepção", status: processo.numero_acta ? "Concluído" as const : "Pendente" as const, data: processo.numero_acta ? format(new Date(processo.atualizado_em), "dd/MM/yyyy", { locale: pt }) : "-" },
      { etapa: "Validação Chefe de Secretaria", status: processo.status === "aguarda_validacao_chefe" ? "Em Andamento" as const : (processo.status === "aceite" ? "Concluído" as const : "Pendente" as const), data: "-" },
      { etapa: "Registo e Autuação", status: "Pendente" as const, data: "-" },
      { etapa: "Análise Técnica", status: "Pendente" as const, data: "-" },
      { etapa: "Decisão do Juiz Relator", status: "Pendente" as const, data: "-" },
      { etapa: "Cobrança de Emolumentos", status: "Pendente" as const, data: "-" },
      { etapa: "Saída de Expediente", status: "Pendente" as const, data: "-" },
    ];
    return steps;
  };

  const tramitacao = getTramitacao();
  const etapaAtual = tramitacao.find(t => t.status === "Em Andamento")?.etapa || tramitacao.find(t => t.status === "Pendente")?.etapa || "Submissão";

  return (
    <div className="space-y-6">
      {/* Header like DetalheProcessoVisto */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Processo {processo.numero_referencia}
            </h1>
            <Badge className={`${statusColors[processo.status] || "bg-muted"} gap-1`}>
              {statusIcons[processo.status]}
              {statusLabels[processo.status] || processo.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {processo.tipo_processo || "Pedido de Visto"}
          </p>
        </div>
        {editable && !editing && (
          <Button variant="outline" className="gap-2" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        )}
        {editing && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>Cancelar</Button>
            <Button className="gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar
            </Button>
          </div>
        )}
      </div>

      {/* 4 Top Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Entidade Contratante</p>
              <p className="font-semibold text-foreground text-sm">{processo.entidade_contratante || "-"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Valor do Contrato</p>
              <p className="font-semibold text-foreground">{formatCurrency(processo.valor_contrato)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-accent">
          <div className="flex items-center gap-3">
            <FileCheck className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Natureza</p>
              <p className="font-semibold text-foreground text-sm">{naturezaVisto || "-"}</p>
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
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Objecto</span>
              <p className="text-sm font-medium text-foreground mt-1 line-clamp-4">{objeto || "-"}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">Tipo de Visto</span>
              <Badge variant="outline" className="border-primary text-primary text-xs">{tipoVisto || "-"}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contratada</span>
              <span className="text-sm font-semibold text-foreground">{entidadeContratada || "-"}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">NIF</span>
              <span className="text-sm font-mono font-medium text-foreground">{nifContratada || "-"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fonte Financiamento</span>
              <span className="text-sm font-semibold text-foreground uppercase">{fonteFinanciamento || "-"}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">Data Contrato</span>
              <span className="text-sm font-medium text-foreground">
                {dataContrato ? format(new Date(dataContrato), "dd/MM/yyyy", { locale: pt }) : "-"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs: Tramitação, Documentos, Informações, Observações */}
      <Tabs defaultValue="tramitacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tramitacao" className="font-bold">Tramitação</TabsTrigger>
          <TabsTrigger value="documentos" className="font-bold">Documentos</TabsTrigger>
          <TabsTrigger value="informacoes" className="font-bold">Informações</TabsTrigger>
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
                  {(() => {
                    // Mostrar apenas: etapas concluídas, etapa actual (Em Andamento) e a próxima (Pendente)
                    const currentIndex = tramitacao.findIndex(t => t.status === "Em Andamento");
                    const firstPendingIndex = tramitacao.findIndex(t => t.status === "Pendente");
                    
                    // Determinar qual é a "etapa actual" e a "próxima"
                    const activeIndex = currentIndex >= 0 ? currentIndex : firstPendingIndex;
                    const nextIndex = activeIndex >= 0 ? activeIndex + 1 : -1;

                    const visibleSteps = tramitacao.filter((step, index) => {
                      if (step.status === "Concluído") return true;
                      if (index === activeIndex) return true;
                      if (index === nextIndex) return true;
                      return false;
                    });

                    return visibleSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.status === "Concluído" 
                              ? "bg-green-500 text-white" 
                              : step.status === "Em Andamento" 
                              ? "bg-primary text-primary-foreground animate-pulse" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {step.status === "Concluído" ? <CheckCircle className="h-4 w-4" /> : tramitacao.indexOf(step) + 1}
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
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <div className="space-y-4">
            {/* Lista de Documentos Submetidos e Gerados */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  Documentos do Processo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentosLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Documentos submetidos pela entidade */}
                    {documentos.length > 0 && documentos.map((doc: any, index: number) => (
                      <div key={`sub-${index}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {doc.etiqueta ? `${doc.etiqueta}` : (doc.nome || doc.name || `Documento ${index + 1}`)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.nome || doc.name || "Documento"}
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

                    {/* Documentos Gerados pelo Sistema */}
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

            {/* Formulário de upload — apenas para processos editáveis */}
            {editable && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Save className="h-4 w-4 text-primary" />
                    Anexar Novos Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DocumentChecklist
                    documents={[...DOCUMENTOS_DISPONIVEIS]}
                    requiredDocuments={[...DOCUMENTOS_OBRIGATORIOS]}
                    onFilesChange={setDocumentosFicheiros}
                    label="Anexar Documentos (PDF)"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleUploadDocumentos}
                      disabled={documentosUploading}
                      className="gap-2"
                    >
                      {documentosUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Anexar Documentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="informacoes">
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Informações Gerais</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assunto *</Label>
                    <Input value={assunto} onChange={e => setAssunto(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Visto *</Label>
                    <Select value={tipoVisto} onValueChange={setTipoVisto}>
                      <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visto Prévio">Visto Prévio</SelectItem>
                        <SelectItem value="Visto Sucessivo">Visto Sucessivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Natureza *</Label>
                    <Select value={naturezaVisto} onValueChange={setNaturezaVisto}>
                      <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                        <SelectItem value="Muito Urgente">Muito Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Partes e Valores</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Entidade Contratada *</Label>
                    <Input value={entidadeContratada} onChange={e => setEntidadeContratada(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>NIF Contratada</Label>
                    <Input value={nifContratada} onChange={e => setNifContratada(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor do Contrato</Label>
                    <CurrencyInput value={valorContrato} onChange={setValorContrato} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fonte de Financiamento</Label>
                    <Input value={fonteFinanciamento} onChange={e => setFonteFinanciamento(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Objecto do Contrato *</Label>
                    <Textarea value={objeto} onChange={e => setObjeto(e.target.value)} rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileCheck className="h-4 w-4 text-primary" /> Informações Gerais</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Assunto</span><span className="font-medium text-right max-w-[60%]">{assunto}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Tipo de Visto</span><span className="font-medium">{tipoVisto || "-"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Natureza</span><span className="font-medium">{naturezaVisto || "-"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Nº Contrato</span><span className="font-medium">{processo.numero_contrato || "-"}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Building className="h-4 w-4 text-primary" /> Partes Contratantes</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Contratante</span><span className="font-medium text-right max-w-[60%]">{processo.entidade_contratante || "-"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Contratada</span><span className="font-medium text-right max-w-[60%]">{entidadeContratada || "-"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">NIF Contratada</span><span className="font-medium">{nifContratada || "-"}</span></div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="observacoes">
          <Card>
            <CardHeader><CardTitle className="text-sm">Objecto e Observações</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Objecto do Contrato *</Label>
                    <Textarea value={objeto} onChange={e => setObjeto(e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={3} />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-muted-foreground">Objecto do Contrato</span>
                    <p className="font-medium mt-1">{objeto || "-"}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground">Observações</span>
                    <p className="font-medium mt-1">{observacoes || "Sem observações"}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function PortalEntidadesProcessos({ entidadeId }: { entidadeId: string }) {
  const [processos, setProcessos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState<any>(null);

  useEffect(() => {
    loadProcessos();
  }, [entidadeId]);

  const loadProcessos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("submissoes_entidade")
      .select("*")
      .eq("entidade_id", entidadeId)
      .order("criado_em", { ascending: false });
    setProcessos(data || []);
    setLoading(false);
  };

  const filtered = processos.filter(p =>
    !search || p.assunto?.toLowerCase().includes(search.toLowerCase()) ||
    p.numero_referencia?.toLowerCase().includes(search.toLowerCase()) ||
    p.tipo_processo?.toLowerCase().includes(search.toLowerCase())
  );

  const handleProcessoUpdated = (updated: any) => {
    setSelectedProcesso(updated);
    setProcessos(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  if (selectedProcesso) {
    return (
      <DetalheProcesso
        processo={selectedProcesso}
        onBack={() => setSelectedProcesso(null)}
        onUpdated={handleProcessoUpdated}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Consulta de Processos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por número, assunto ou tipo..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum processo encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Referência</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.numero_referencia}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="border-primary text-primary">
                        {p.tipo_processo}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{p.assunto}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[p.status] || "bg-muted"} gap-1`}>
                        {statusIcons[p.status]}
                        {statusLabels[p.status] || p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm hidden md:table-cell">
                      {p.criado_em ? format(new Date(p.criado_em), "dd/MM/yyyy", { locale: pt }) : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedProcesso(p)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
