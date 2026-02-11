import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, FileText, Loader2 } from "lucide-react";
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

const statusLabels: Record<string, string> = {
  submetido: "Submetido",
  em_analise: "Em Análise",
  aguarda_validacao_chefe: "Aguarda Validação Chefe",
  aceite: "Aceite",
  rejeitado: "Rejeitado",
  devolvido: "Devolvido",
};

export function PortalEntidadesSubmissoes({ entidadeId, entidadeNome, onBack, tipoFiltro }: Props) {
  const [submissoes, setSubmissoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
            <Plus className="h-4 w-4 mr-2" /> Nova Submissão
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
                Clique em "Novo Pedido de Visto" para submeter um processo
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissoes.map((s) => (
              <Card key={s.id} className="hover:shadow-sm transition-shadow">
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
                      {s.entidade_contratante && (
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
                    <div className="text-right text-xs text-muted-foreground">
                      {format(new Date(s.criado_em), "dd/MM/yyyy HH:mm", { locale: pt })}
                      {s.valor_contrato && (
                        <p className="font-medium text-foreground mt-1">
                          {new Intl.NumberFormat("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          }).format(s.valor_contrato)}
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
