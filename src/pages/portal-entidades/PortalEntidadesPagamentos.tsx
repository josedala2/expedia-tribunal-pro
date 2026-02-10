import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, DollarSign, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Props {
  entidadeId: string;
  onBack: () => void;
}

const statusColors: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800",
  pago: "bg-green-100 text-green-800",
  vencido: "bg-red-100 text-red-800",
  anulado: "bg-slate-100 text-slate-800",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  vencido: "Vencido",
  anulado: "Anulado",
};

export function PortalEntidadesPagamentos({ entidadeId, onBack }: Props) {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPagamentos(); }, []);

  const loadPagamentos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("pagamentos_entidade")
      .select("*")
      .eq("entidade_id", entidadeId)
      .order("criado_em", { ascending: false });
    setPagamentos(data || []);
    setLoading(false);
  };

  const totalPendente = pagamentos
    .filter(p => p.status === "pendente")
    .reduce((sum, p) => sum + (p.valor || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold">Emolumentos e Pagamentos</h1>
            <p className="text-sm text-muted-foreground">Gerir pagamentos ao Tribunal</p>
          </div>
        </div>

        {totalPendente > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-sm text-amber-800">Total Pendente</p>
                <p className="text-2xl font-bold text-amber-900">
                  {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(totalPendente)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : pagamentos.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum pagamento registado</p>
            <p className="text-sm">Os emolumentos aparecerão aqui quando forem gerados pelo Tribunal</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {pagamentos.map((p) => (
              <Card key={p.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[p.status] || ""}>{statusLabels[p.status] || p.status}</Badge>
                        {p.referencia_pagamento && <span className="font-mono text-xs text-muted-foreground">{p.referencia_pagamento}</span>}
                      </div>
                      <h3 className="font-semibold">{p.descricao}</h3>
                      {p.data_vencimento && (
                        <p className="text-xs text-muted-foreground">
                          Vencimento: {format(new Date(p.data_vencimento), "dd/MM/yyyy", { locale: pt })}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold">
                        {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(p.valor)}
                      </p>
                      {p.data_pagamento && (
                        <p className="text-xs text-green-600">
                          Pago em {format(new Date(p.data_pagamento), "dd/MM/yyyy", { locale: pt })}
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
