import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Props {
  entidadeId: string;
  onBack: () => void;
}

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

export function PortalEntidadesProcessos({ entidadeId, onBack }: Props) {
  const [processos, setProcessos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadProcessos(); }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold">Consulta de Processos</h1>
            <p className="text-sm text-muted-foreground">Acompanhe o estado dos seus processos</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar por assunto, referência ou tipo..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum processo encontrado</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <Card key={p.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{p.numero_referencia}</span>
                        <Badge className={statusColors[p.status] || ""}>{statusLabels[p.status] || p.status}</Badge>
                        <Badge variant="outline">{p.tipo_processo}</Badge>
                      </div>
                      <h3 className="font-semibold">{p.assunto}</h3>
                      {p.descricao && <p className="text-sm text-muted-foreground line-clamp-2">{p.descricao}</p>}
                      {p.processo_interno_id && (
                        <p className="text-xs text-primary">Processo Interno: {p.processo_interno_id}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <p>{format(new Date(p.criado_em), "dd/MM/yyyy", { locale: pt })}</p>
                      {p.valor_contrato && (
                        <p className="font-medium text-foreground mt-1">
                          {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(p.valor_contrato)}
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
