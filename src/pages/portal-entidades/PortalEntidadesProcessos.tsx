import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, FileText, Filter, Clock, CheckCircle, XCircle, ArrowLeft, Building, Calendar, User, FileCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

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

function DetalheProcesso({ processo, onBack }: { processo: any; onBack: () => void }) {
  const formatCurrency = (val: number | null) =>
    val != null ? new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(val) : "-";

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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assunto</span>
              <span className="font-medium text-right max-w-[60%]">{processo.assunto}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo de Visto</span>
              <span className="font-medium">{processo.tipo_visto || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Natureza</span>
              <span className="font-medium">{processo.natureza_visto || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nº Contrato</span>
              <span className="font-medium">{processo.numero_contrato || "-"}</span>
            </div>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contratante</span>
              <span className="font-medium text-right max-w-[60%]">{processo.entidade_contratante || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contratada</span>
              <span className="font-medium text-right max-w-[60%]">{processo.entidade_contratada || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">NIF Contratada</span>
              <span className="font-medium">{processo.nif_contratada || "-"}</span>
            </div>
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
                {processo.data_contrato ? format(new Date(processo.data_contrato), "dd/MM/yyyy", { locale: pt }) : "-"}
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
              <span className="font-medium">{processo.fonte_financiamento || "-"}</span>
            </div>
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
            <div>
              <span className="text-muted-foreground">Objecto do Contrato</span>
              <p className="font-medium mt-1">{processo.objeto || "-"}</p>
            </div>
            <Separator />
            <div>
              <span className="text-muted-foreground">Observações</span>
              <p className="font-medium mt-1">{processo.observacoes || "Sem observações"}</p>
            </div>
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
