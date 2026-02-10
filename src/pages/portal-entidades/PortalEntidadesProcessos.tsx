import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, FileText, Filter, Clock, CheckCircle, XCircle, ArrowLeft, Building, Calendar, User, FileCheck, Pencil, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";

interface Props {
  entidadeId: string;
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  submetido: "bg-blue-500 text-white",
  em_analise: "bg-amber-500 text-white",
  aceite: "bg-green-500 text-white",
  rejeitado: "bg-red-500 text-white",
  devolvido: "bg-orange-500 text-white",
};

const statusLabels: Record<string, string> = {
  submetido: "Submetido",
  em_analise: "Em Análise",
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

function DetalheProcesso({ processo, onBack, onUpdated }: { processo: any; onBack: () => void; onUpdated: (updated: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
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

  const formatCurrency = (val: number | null) =>
    val != null ? new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(val) : "-";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-bold text-foreground">{processo.numero_referencia}</h3>
          <p className="text-sm text-muted-foreground">{processo.tipo_processo}</p>
        </div>
        <Badge className={`${statusColors[processo.status] || "bg-muted"} gap-1 ml-auto`}>
          {statusIcons[processo.status]}
          {statusLabels[processo.status] || processo.status}
        </Badge>
      </div>

      {editable && !editing && (
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" />
            Editar Pedido
          </Button>
        </div>
      )}

      {editing && (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel} disabled={saving}>Cancelar</Button>
          <Button className="gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar Alterações
          </Button>
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {editing ? (
              <div className="space-y-4">
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
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assunto</span>
                  <span className="font-medium text-right max-w-[60%]">{assunto}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Visto</span>
                  <span className="font-medium">{tipoVisto || "-"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Natureza</span>
                  <span className="font-medium">{naturezaVisto || "-"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nº Contrato</span>
                  <span className="font-medium">{processo.numero_contrato || "-"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              Partes Contratantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Entidade Contratante</Label>
                  <Input value={processo.entidade_contratante || "-"} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Entidade Contratada *</Label>
                  <Input value={entidadeContratada} onChange={e => setEntidadeContratada(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>NIF Contratada</Label>
                  <Input value={nifContratada} onChange={e => setNifContratada(e.target.value)} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contratante</span>
                  <span className="font-medium text-right max-w-[60%]">{processo.entidade_contratante || "-"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contratada</span>
                  <span className="font-medium text-right max-w-[60%]">{entidadeContratada || "-"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NIF Contratada</span>
                  <span className="font-medium">{nifContratada || "-"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Datas e Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Data do Contrato</Label>
                  <Input type="date" value={dataContrato} onChange={e => setDataContrato(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Valor do Contrato</Label>
                  <CurrencyInput value={valorContrato} onChange={setValorContrato} />
                </div>
                <div className="space-y-2">
                  <Label>Fonte de Financiamento</Label>
                  <Input value={fonteFinanciamento} onChange={e => setFonteFinanciamento(e.target.value)} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Submissão</span>
                  <span className="font-medium">
                    {processo.criado_em ? format(new Date(processo.criado_em), "dd/MM/yyyy HH:mm", { locale: pt }) : "-"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data do Contrato</span>
                  <span className="font-medium">
                    {dataContrato ? format(new Date(dataContrato), "dd/MM/yyyy", { locale: pt }) : "-"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor do Contrato</span>
                  <span className="font-medium">{formatCurrency(processo.valor_contrato)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fonte de Financiamento</span>
                  <span className="font-medium">{fonteFinanciamento || "-"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Objecto e Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
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
      </div>
    </div>
  );
}

export function PortalEntidadesProcessos({ entidadeId, open, onClose }: Props) {
  const [processos, setProcessos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState<any>(null);

  useEffect(() => {
    if (open) loadProcessos();
    if (!open) setSelectedProcesso(null);
  }, [open]);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selectedProcesso ? "Detalhes do Processo" : "Consulta de Processos"}
          </DialogTitle>
        </DialogHeader>

        {selectedProcesso ? (
          <DetalheProcesso
            processo={selectedProcesso}
            onBack={() => setSelectedProcesso(null)}
            onUpdated={handleProcessoUpdated}
          />
        ) : (
          <div className="space-y-4 mt-2">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por número, assunto ou departamento..."
                  className="pl-9"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum processo encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Referência</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.numero_referencia}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary text-primary">
                          {p.tipo_processo}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{p.assunto}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-muted">
                          Normal
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[p.status] || "bg-muted"} gap-1`}>
                          {statusIcons[p.status]}
                          {statusLabels[p.status] || p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
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
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
