import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Bell, Loader2, Mail, MailOpen } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";

interface Props {
  entidadeId: string;
  onBack: () => void;
}

const tipoColors: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  despacho: "bg-purple-100 text-purple-800",
  notificacao: "bg-amber-100 text-amber-800",
  oficio: "bg-emerald-100 text-emerald-800",
  urgente: "bg-red-100 text-red-800",
};

const tipoLabels: Record<string, string> = {
  info: "Informação",
  despacho: "Despacho",
  notificacao: "Notificação",
  oficio: "Ofício",
  urgente: "Urgente",
};

export function PortalEntidadesNotificacoes({ entidadeId, onBack }: Props) {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotificacoes(); }, []);

  const loadNotificacoes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notificacoes_entidade")
      .select("*")
      .eq("entidade_id", entidadeId)
      .order("criado_em", { ascending: false });
    setNotificacoes(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from("notificacoes_entidade").update({
      lida: true,
      lida_por: session.user.id,
      lida_em: new Date().toISOString(),
    }).eq("id", id);

    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const markAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const unread = notificacoes.filter(n => !n.lida);
    for (const n of unread) {
      await supabase.from("notificacoes_entidade").update({
        lida: true, lida_por: session.user.id, lida_em: new Date().toISOString(),
      }).eq("id", n.id);
    }
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    toast.success("Todas marcadas como lidas");
  };

  const unreadCount = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-2xl font-bold">Notificações</h1>
              <p className="text-sm text-muted-foreground">{unreadCount} não lida(s)</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <MailOpen className="h-4 w-4 mr-2" /> Marcar todas como lidas
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : notificacoes.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma notificação</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {notificacoes.map((n) => (
              <Card
                key={n.id}
                className={`transition-shadow cursor-pointer ${!n.lida ? "border-l-4 border-l-primary bg-primary/5" : ""}`}
                onClick={() => !n.lida && markAsRead(n.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {n.lida ? <MailOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" /> : <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold ${!n.lida ? "text-primary" : ""}`}>{n.titulo}</h3>
                        <Badge className={tipoColors[n.tipo] || ""}>{tipoLabels[n.tipo] || n.tipo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.mensagem}</p>
                      {n.processo_referencia && (
                        <p className="text-xs text-primary">Processo: {n.processo_referencia}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(n.criado_em), "dd/MM/yyyy HH:mm", { locale: pt })}
                    </span>
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
