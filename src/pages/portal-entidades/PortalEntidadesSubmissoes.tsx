import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, FileText, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Props {
  entidadeId: string;
  onBack: () => void;
}

const tiposProcesso = [
  "Prestação de Contas",
  "Visto Prévio",
  "Visto Sucessivo",
  "Requerimento",
  "Resposta a Notificação",
  "Pedido de Redução de Emolumentos",
  "Recurso",
  "Outro",
];

const statusColors: Record<string, string> = {
  submetido: "bg-blue-100 text-blue-800",
  em_analise: "bg-amber-100 text-amber-800",
  aceite: "bg-green-100 text-green-800",
  rejeitado: "bg-red-100 text-red-800",
  devolvido: "bg-orange-100 text-orange-800",
};

const statusLabels: Record<string, string> = {
  submetido: "Submetido",
  em_analise: "Em Análise",
  aceite: "Aceite",
  rejeitado: "Rejeitado",
  devolvido: "Devolvido",
};

export function PortalEntidadesSubmissoes({ entidadeId, onBack }: Props) {
  const [submissoes, setSubmissoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [tipo, setTipo] = useState("");
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorContrato, setValorContrato] = useState("");

  useEffect(() => { loadSubmissoes(); }, []);

  const loadSubmissoes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("submissoes_entidade")
      .select("*")
      .eq("entidade_id", entidadeId)
      .order("criado_em", { ascending: false });
    setSubmissoes(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");

      const numero = `SUB-${Date.now().toString(36).toUpperCase()}`;
      const { error } = await supabase.from("submissoes_entidade").insert({
        entidade_id: entidadeId,
        submetido_por: session.user.id,
        tipo_processo: tipo,
        numero_referencia: numero,
        assunto,
        descricao: descricao || null,
        valor_contrato: valorContrato ? parseFloat(valorContrato) : null,
      });
      if (error) throw error;

      toast.success("Processo submetido com sucesso!");
      setDialogOpen(false);
      setTipo(""); setAssunto(""); setDescricao(""); setValorContrato("");
      loadSubmissoes();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-2xl font-bold">Submissão de Processos</h1>
              <p className="text-sm text-muted-foreground">Submeta novos processos ao Tribunal de Contas</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Nova Submissão</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Submissão de Processo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Processo *</Label>
                  <Select value={tipo} onValueChange={setTipo} required>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {tiposProcesso.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assunto *</Label>
                  <Input value={assunto} onChange={e => setAssunto(e.target.value)} required placeholder="Assunto do processo" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição detalhada" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Valor do Contrato (AOA)</Label>
                  <Input type="number" value={valorContrato} onChange={e => setValorContrato(e.target.value)} placeholder="0,00" />
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !tipo || !assunto}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Submeter
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : submissoes.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma submissão encontrada</p>
            <p className="text-sm">Clique em "Nova Submissão" para submeter um processo</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {submissoes.map((s) => (
              <Card key={s.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{s.numero_referencia}</span>
                        <Badge className={statusColors[s.status] || ""}>{statusLabels[s.status] || s.status}</Badge>
                      </div>
                      <h3 className="font-semibold">{s.assunto}</h3>
                      <p className="text-sm text-muted-foreground">{s.tipo_processo}</p>
                      {s.motivo_devolucao && (
                        <p className="text-sm text-orange-600 mt-1">Motivo: {s.motivo_devolucao}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {format(new Date(s.criado_em), "dd/MM/yyyy HH:mm", { locale: pt })}
                      {s.valor_contrato && (
                        <p className="font-medium text-foreground mt-1">
                          {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(s.valor_contrato)}
                        </p>
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
