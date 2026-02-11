import { useState, useEffect } from "react";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentChecklist } from "@/components/ui/document-checklist";
import { CurrencyInput } from "@/components/ui/currency-input";
import { supabase } from "@/integrations/supabase/client";
import { generateContractNumber, validateName, validateNIF, validateDateNotFuture } from "@/lib/validations";
import { toast } from "sonner";
interface Props {
  entidadeId: string;
  entidadeNome: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function FormularioVistoEntidade({ entidadeId, entidadeNome, onBack, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numeroContratoGerado, setNumeroContratoGerado] = useState("");

  // Form state
  const [tipoVisto, setTipoVisto] = useState("");
  const [naturezaVisto, setNaturezaVisto] = useState("");
  const [entidadeContratante, setEntidadeContratante] = useState(entidadeNome);
  const [entidadeContratada, setEntidadeContratada] = useState("");
  const [nifContratada, setNifContratada] = useState("");
  const [objeto, setObjeto] = useState("");
  const [valorContrato, setValorContrato] = useState("");
  const [fonteFinanciamento, setFonteFinanciamento] = useState("");
  const [dataContrato, setDataContrato] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPrestacaoContas = tipoVisto === "prestacao_contas";

  const DOCUMENTOS_VISTO = [
    "Ofício de Solicitação de Visto",
    "Minuta do Contrato",
    "Cabimento Orçamental",
    "Proposta de Adjudicação / Despacho de Adjudicação",
    "Programa de Concurso / Caderno de Encargos",
    "Documentos de Habilitação da Empresa",
    "Certidão Negativa de Dívidas Fiscais",
    "Declaração de Regularidade com Segurança Social",
  ] as const;

  const DOCUMENTOS_VISTO_OBRIGATORIOS = [
    "Ofício de Solicitação de Visto",
    "Minuta do Contrato",
    "Cabimento Orçamental",
  ] as const;

  const DOCUMENTOS_PRESTACAO = [
    "Ofício de Remessa da Conta",
    "Balancete Analítico",
    "Relatório de Gestão / Relatório de Actividades",
    "Demonstrações Financeiras",
    "Parecer do Órgão de Fiscalização Interna",
    "Certidão de Quitação / Declaração de Conformidade",
    "Mapa de Execução Orçamental",
    "Documentos Justificativos de Despesas",
  ] as const;

  const DOCUMENTOS_PRESTACAO_OBRIGATORIOS = [
    "Ofício de Remessa da Conta",
    "Balancete Analítico",
    "Relatório de Gestão / Relatório de Actividades",
    "Demonstrações Financeiras",
  ] as const;

  const DOCUMENTOS_DISPONIVEIS = isPrestacaoContas ? DOCUMENTOS_PRESTACAO : DOCUMENTOS_VISTO;
  const DOCUMENTOS_OBRIGATORIOS = isPrestacaoContas ? DOCUMENTOS_PRESTACAO_OBRIGATORIOS : DOCUMENTOS_VISTO_OBRIGATORIOS;

  const [documentosFicheiros, setDocumentosFicheiros] = useState<Map<string, File>>(new Map());
  useEffect(() => {
    setNumeroContratoGerado(generateContractNumber());
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!tipoVisto) newErrors.tipoVisto = "O tipo de processo é obrigatório";
    if (!isPrestacaoContas && !naturezaVisto) newErrors.naturezaVisto = "A natureza do visto é obrigatória";
    if (!entidadeContratante) newErrors.entidadeContratante = "A entidade é obrigatória";

    if (!isPrestacaoContas) {
      if (!entidadeContratada || entidadeContratada.length < 2) {
        newErrors.entidadeContratada = "O nome da entidade contratada deve ter pelo menos 2 caracteres";
      } else {
        const nameVal = validateName(entidadeContratada);
        if (!nameVal.valid) newErrors.entidadeContratada = nameVal.message || "Nome inválido";
      }

      if (!nifContratada || !/^\d{9}$/.test(nifContratada)) {
        newErrors.nifContratada = "O NIF deve ter exactamente 9 dígitos";
      }
    }

    if (!objeto || objeto.length < 10) {
      newErrors.objeto = "O objecto do contrato deve ter pelo menos 10 caracteres";
    }

    if (!valorContrato) newErrors.valorContrato = "O valor do contrato é obrigatório";
    if (!fonteFinanciamento) newErrors.fonteFinanciamento = "A fonte de financiamento é obrigatória";

    if (!dataContrato) {
      newErrors.dataContrato = "A data do contrato é obrigatória";
    } else {
      const dateVal = validateDateNotFuture(dataContrato);
      if (!dateVal.valid) newErrors.dataContrato = dateVal.message || "Data inválida";
    }

    const missingRequired = DOCUMENTOS_OBRIGATORIOS.filter((doc) => !documentosFicheiros.has(doc));
    if (missingRequired.length > 0) {
      newErrors.documentos = "Anexe os documentos obrigatórios (PDF) antes de submeter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");

      const sanitizeFileName = (name: string) =>
        name
          .normalize("NFKD")
          .replace(/[^\w.\-]+/g, "_")
          .replace(/_+/g, "_")
          .slice(0, 120);

      const numero = `SUB-${tipoVisto === "prestacao_contas" ? "PC" : "VP"}-${Date.now().toString(36).toUpperCase()}`;
      const tipoLabel = tipoVisto === "previo" ? "Visto Prévio" : tipoVisto === "sucessivo" ? "Visto Sucessivo" : "Prestação de Contas";

      // 1) Criar a submissão
      const { data: submissaoCriada, error: insertError } = await supabase
        .from("submissoes_entidade")
        .insert({
          entidade_id: entidadeId,
          submetido_por: session.user.id,
          tipo_processo: tipoLabel,
          numero_referencia: numero,
          assunto: objeto,
          descricao: observacoes || null,
          valor_contrato: valorContrato ? parseFloat(valorContrato) : null,
          tipo_visto: tipoVisto,
          natureza_visto: naturezaVisto,
          entidade_contratante: entidadeContratante,
          entidade_contratada: entidadeContratada,
          nif_contratada: nifContratada,
          objeto,
          fonte_financiamento: fonteFinanciamento,
          numero_contrato: numeroContratoGerado,
          data_contrato: dataContrato,
          observacoes: observacoes || null,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      if (!submissaoCriada?.id) throw new Error("Não foi possível criar a submissão");

      // 2) Upload dos documentos (PDF)
      const docsMeta: any[] = [];
      const entries = Array.from(documentosFicheiros.entries());

      for (const [etiqueta, file] of entries) {
        const safeName = sanitizeFileName(file.name);
        const storagePath = `${session.user.id}/${submissaoCriada.id}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("processo-documentos")
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          toast.error("Erro ao anexar documento", {
            description: `Não foi possível anexar "${file.name}".`,
          });
          continue;
        }

        docsMeta.push({
          etiqueta,
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          storage_path: storagePath,
        });
      }

      // 3) Guardar metadados dos documentos na submissão
      if (docsMeta.length > 0) {
        const { error: docsError } = await supabase
          .from("submissoes_entidade")
          .update({ documentos: docsMeta })
          .eq("id", submissaoCriada.id);

        if (docsError) throw docsError;
      }

      toast.success("Processo submetido com sucesso!", {
        description: `Referência: ${numero}. A Secretaria do Tribunal será notificada.`,
      });
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao submeter o pedido", {
        description: error?.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-7 w-7 text-primary" />
              {isPrestacaoContas ? "Registo de Expediente de Prestação de Contas" : "Novo Pedido de Visto"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isPrestacaoContas 
                ? "Submissão de contas para apreciação do Tribunal de Contas" 
                : "Registo de expediente para pedido de visto prévio ou sucessivo"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          {/* Tipo e Natureza */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Tipo de Processo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tipo de Processo *</Label>
                <Select value={tipoVisto} onValueChange={setTipoVisto}>
                  <SelectTrigger className={errors.tipoVisto ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="previo">Visto Prévio</SelectItem>
                    <SelectItem value="sucessivo">Visto Sucessivo</SelectItem>
                    <SelectItem value="prestacao_contas">Prestação de Contas</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoVisto && <p className="text-sm text-destructive">{errors.tipoVisto}</p>}
              </div>

              {!isPrestacaoContas && (
              <div className="space-y-2">
                <Label>Natureza do Visto *</Label>
                <Select value={naturezaVisto} onValueChange={setNaturezaVisto}>
                  <SelectTrigger className={errors.naturezaVisto ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccione a natureza" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="normal">Visto Normal (30 dias)</SelectItem>
                    <SelectItem value="urgencia">Visto Simplificado de Urgência (10 dias)</SelectItem>
                    <SelectItem value="urgente">Visto de Carácter Urgente (5 dias)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.naturezaVisto && <p className="text-sm text-destructive">{errors.naturezaVisto}</p>}
              </div>
              )}
            </div>
          </Card>

          {/* Partes Contratantes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{isPrestacaoContas ? "Dados da Entidade" : "Partes Contratantes"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Entidade Contratante (Pública) *</Label>
                <Input
                  value={entidadeContratante}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Preenchido automaticamente com a sua entidade</p>
              </div>

              {!isPrestacaoContas && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Entidade Contratada *</Label>
                  <Input
                    value={entidadeContratada}
                    onChange={(e) => setEntidadeContratada(e.target.value)}
                    placeholder="Nome da empresa ou entidade contratada"
                    className={errors.entidadeContratada ? "border-destructive" : ""}
                  />
                  {errors.entidadeContratada && <p className="text-sm text-destructive">{errors.entidadeContratada}</p>}
                </div>

                <div className="space-y-2">
                  <Label>NIF da Entidade Contratada *</Label>
                  <Input
                    value={nifContratada}
                    onChange={(e) => setNifContratada(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="000000000"
                    maxLength={9}
                    className={errors.nifContratada ? "border-destructive" : ""}
                  />
                  {errors.nifContratada && <p className="text-sm text-destructive">{errors.nifContratada}</p>}
                </div>
              </div>
              )}
            </div>
          </Card>

          {/* Dados do Contrato / Exercício */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{isPrestacaoContas ? "Dados da Prestação de Contas" : "Dados do Contrato"}</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{isPrestacaoContas ? "Descrição / Objecto da Prestação de Contas *" : "Objecto do Contrato *"}</Label>
                <Textarea
                  value={objeto}
                  onChange={(e) => setObjeto(e.target.value)}
                  placeholder="Descreva o objecto do contrato..."
                  className={`min-h-[100px] ${errors.objeto ? "border-destructive" : ""}`}
                />
                {errors.objeto && <p className="text-sm text-destructive">{errors.objeto}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Valor do Contrato *</Label>
                  <CurrencyInput
                    value={valorContrato}
                    onChange={(value) => setValorContrato(value)}
                    placeholder="0"
                    className={errors.valorContrato ? "border-destructive" : ""}
                  />
                  {errors.valorContrato && <p className="text-sm text-destructive">{errors.valorContrato}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Nº do Contrato (Automático)</Label>
                  <Input value={numeroContratoGerado} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Gerado automaticamente</p>
                </div>

                <div className="space-y-2">
                  <Label>Data do Contrato *</Label>
                  <Input
                    type="date"
                    value={dataContrato}
                    onChange={(e) => setDataContrato(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={errors.dataContrato ? "border-destructive" : ""}
                  />
                  {errors.dataContrato && <p className="text-sm text-destructive">{errors.dataContrato}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fonte de Financiamento *</Label>
                <Select value={fonteFinanciamento} onValueChange={setFonteFinanciamento}>
                  <SelectTrigger className={errors.fonteFinanciamento ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccione a fonte" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="oge">Orçamento Geral do Estado (OGE)</SelectItem>
                    <SelectItem value="fundos-autonomos">Fundos Autónomos</SelectItem>
                    <SelectItem value="cooperacao">Cooperação Internacional</SelectItem>
                    <SelectItem value="credito-externo">Crédito Externo</SelectItem>
                    <SelectItem value="receitas-proprias">Receitas Próprias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  A fonte de financiamento determina a divisão competente (1ª ou 2ª Divisão)
                </p>
                {errors.fonteFinanciamento && <p className="text-sm text-destructive">{errors.fonteFinanciamento}</p>}
              </div>
            </div>
          </Card>

          {/* Documentação */}
          <Card className="p-6">
            <DocumentChecklist
              documents={[...DOCUMENTOS_DISPONIVEIS]}
              requiredDocuments={[...DOCUMENTOS_OBRIGATORIOS]}
              selectedDocuments={[...DOCUMENTOS_OBRIGATORIOS]}
              onFilesChange={setDocumentosFicheiros}
              label={isPrestacaoContas ? "Documentação Anexa à Prestação de Contas" : "Documentação Anexa ao Pedido de Visto"}
            />
            {errors.documentos && (
              <p className="text-sm text-destructive mt-2">{errors.documentos}</p>
            )}
          </Card>

          {/* Observações */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Observações</h3>
            <div className="space-y-2">
              <Label>Observações Adicionais</Label>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Adicione observações relevantes ao pedido..."
                className="min-h-[80px]"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end py-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "A Submeter..." : isPrestacaoContas ? "Submeter Prestação de Contas" : "Submeter Pedido de Visto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
