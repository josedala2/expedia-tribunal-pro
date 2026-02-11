import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import logoTC from "@/assets/logo-tc.png";
import {
  Building2, FileText, Bell, DollarSign, Send, LogOut,
  ClipboardList, BookOpen
} from "lucide-react";
import { PortalEntidadesSubmissoes } from "./PortalEntidadesSubmissoes";
import { PortalEntidadesProcessos } from "./PortalEntidadesProcessos";
import { PortalEntidadesNotificacoes } from "./PortalEntidadesNotificacoes";
import { PortalEntidadesPagamentos } from "./PortalEntidadesPagamentos";

type PortalView = "dashboard" | "submissoes" | "submissoes_prestacao" | "notificacoes" | "pagamentos";

export default function PortalEntidadesDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<PortalView>("dashboard");
  const [entidade, setEntidade] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({ submissoes: 0, notificacoesNaoLidas: 0, pagamentosPendentes: 0, processosAtivos: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/portal-entidades"); return; }

    const { data: entUser } = await supabase
      .from("utilizadores_entidade")
      .select("*, entidades_externas:entidade_id(*)")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!entUser) { navigate("/portal-entidades"); return; }

    const ent = (entUser as any).entidades_externas;
    if (ent?.status !== "aprovada") { navigate("/portal-entidades/pendente"); return; }

    setEntidade(ent);
    setUserName(entUser.nome_completo);

    // Load stats
    const entidadeId = entUser.entidade_id;

    const [submissoes, notifs, pagamentos] = await Promise.all([
      supabase.from("submissoes_entidade").select("id", { count: "exact" }).eq("entidade_id", entidadeId),
      supabase.from("notificacoes_entidade").select("id", { count: "exact" }).eq("entidade_id", entidadeId).eq("lida", false),
      supabase.from("pagamentos_entidade").select("id", { count: "exact" }).eq("entidade_id", entidadeId).eq("status", "pendente"),
    ]);

    setStats({
      submissoes: submissoes.count || 0,
      notificacoesNaoLidas: notifs.count || 0,
      pagamentosPendentes: pagamentos.count || 0,
      processosAtivos: submissoes.count || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/portal-entidades");
  };

  if (!entidade) return null;

  const menuItems = [
    { id: "submissoes" as const, label: "Processo de Visto", icon: Send, description: "Submeter pedidos de visto ao tribunal", color: "text-blue-600", bg: "bg-blue-50" },
    { id: "submissoes_prestacao" as const, label: "Prestação de Contas", icon: BookOpen, description: "Submeter prestação de contas", color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "notificacoes" as const, label: "Notificações", icon: Bell, description: "Despachos, ofícios e comunicações", color: "text-amber-600", bg: "bg-amber-50", badge: stats.notificacoesNaoLidas },
    { id: "pagamentos" as const, label: "Emolumentos", icon: DollarSign, description: "Consultar e gerir pagamentos", color: "text-purple-600", bg: "bg-purple-50", badge: stats.pagamentosPendentes },
  ];

  if (currentView === "submissoes") return <PortalEntidadesSubmissoes entidadeId={entidade.id} entidadeNome={entidade.nome} onBack={() => setCurrentView("dashboard")} tipoFiltro="visto" />;
  if (currentView === "submissoes_prestacao") return <PortalEntidadesSubmissoes entidadeId={entidade.id} entidadeNome={entidade.nome} onBack={() => setCurrentView("dashboard")} tipoFiltro="prestacao" />;
  if (currentView === "notificacoes") return <PortalEntidadesNotificacoes entidadeId={entidade.id} onBack={() => setCurrentView("dashboard")} />;
  if (currentView === "pagamentos") return <PortalEntidadesPagamentos entidadeId={entidade.id} onBack={() => setCurrentView("dashboard")} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoTC} alt="TC" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                Portal das Entidades
              </h1>
              <p className="text-xs text-slate-400">Tribunal de Contas de Angola</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-slate-400">{entidade.nome}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-800">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Horizontal Menu Bar */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border-b-2 border-transparent hover:border-primary transition-all whitespace-nowrap relative"
                >
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <Badge className="h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] bg-red-500">{item.badge}</Badge>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-2xl font-bold text-foreground">
            Bem-vindo, <span className="text-primary">{entidade.sigla || entidade.nome}</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Utilize o portal para submeter processos, acompanhar o seu estado e receber comunicações do Tribunal de Contas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Submissões</p>
                  <p className="text-2xl font-bold">{stats.submissoes}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Processos Ativos</p>
                  <p className="text-2xl font-bold">{stats.processosAtivos}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-emerald-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Notificações</p>
                  <p className="text-2xl font-bold">{stats.notificacoesNaoLidas}</p>
                </div>
                <Bell className="h-8 w-8 text-amber-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pagamentos Pend.</p>
                  <p className="text-2xl font-bold">{stats.pagamentosPendentes}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consulta de Processos inline */}
        <PortalEntidadesProcessos entidadeId={entidade.id} />
      </div>
    </div>
  );
}
