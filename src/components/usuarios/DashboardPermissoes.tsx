import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, TrendingUp, AlertCircle, User, Cog, Link2, PieChart } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RechartsePieChart,
  Pie,
  Legend
} from "recharts";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleStats {
  role: AppRole;
  count: number;
  manual: number;
  automatico: number;
  herdado: number;
}

interface TipoAtribuicaoStats {
  tipo: string;
  count: number;
  percentage: number;
}

export const DashboardPermissoes = () => {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersWithoutRoles, setUsersWithoutRoles] = useState(0);
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [tipoStats, setTipoStats] = useState<TipoAtribuicaoStats[]>([]);
  const { toast } = useToast();

  const roleLabels: Record<AppRole, string> = {
    admin: "Administrador",
    tecnico_sg: "Técnico SG",
    chefe_cg: "Chefe CG",
    juiz_relator: "Juiz Relator",
    juiz_adjunto: "Juiz Adjunto",
    presidente_camara: "Presidente Câmara",
    dst: "DST",
    secretaria: "Secretaria",
    ministerio_publico: "Ministério Público",
  };

  const COLORS = {
    admin: "hsl(var(--destructive))",
    tecnico_sg: "hsl(var(--primary))",
    chefe_cg: "hsl(var(--accent))",
    juiz_relator: "hsl(var(--chart-1))",
    juiz_adjunto: "hsl(var(--chart-2))",
    presidente_camara: "hsl(var(--chart-3))",
    dst: "hsl(var(--chart-4))",
    secretaria: "hsl(var(--chart-5))",
    ministerio_publico: "hsl(var(--secondary))",
  };

  const TIPO_COLORS = {
    manual: "hsl(var(--primary))",
    automatico: "hsl(var(--secondary))",
    herdado: "hsl(var(--accent))",
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Total de utilizadores
      const { count: totalCount, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;
      setTotalUsers(totalCount || 0);

      // Buscar todas as roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, tipo_atribuicao");

      if (rolesError) throw rolesError;

      // Utilizadores sem roles
      const usersWithRoles = new Set(rolesData?.map(r => r.user_id) || []);
      setUsersWithoutRoles((totalCount || 0) - usersWithRoles.size);

      // Estatísticas por role
      const roleStatsMap = new Map<AppRole, RoleStats>();
      rolesData?.forEach((r) => {
        const existing = roleStatsMap.get(r.role) || {
          role: r.role,
          count: 0,
          manual: 0,
          automatico: 0,
          herdado: 0,
        };

        existing.count++;
        if (r.tipo_atribuicao === 'manual') existing.manual++;
        else if (r.tipo_atribuicao === 'automatico') existing.automatico++;
        else if (r.tipo_atribuicao === 'herdado') existing.herdado++;

        roleStatsMap.set(r.role, existing);
      });

      const roleStatsArray = Array.from(roleStatsMap.values()).sort((a, b) => b.count - a.count);
      setRoleStats(roleStatsArray);

      // Estatísticas por tipo de atribuição
      const tipoMap = new Map<string, number>();
      rolesData?.forEach((r) => {
        const tipo = r.tipo_atribuicao || 'manual';
        tipoMap.set(tipo, (tipoMap.get(tipo) || 0) + 1);
      });

      const totalRoles = rolesData?.length || 0;
      const tipoStatsArray = Array.from(tipoMap.entries()).map(([tipo, count]) => ({
        tipo,
        count,
        percentage: totalRoles > 0 ? (count / totalRoles) * 100 : 0,
      }));

      setTipoStats(tipoStatsArray);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar estatísticas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      manual: "Manual",
      automatico: "Automática",
      herdado: "Herdada",
    };
    return labels[tipo] || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'manual':
        return <User className="h-4 w-4" />;
      case 'automatico':
        return <Cog className="h-4 w-4" />;
      case 'herdado':
        return <Link2 className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
              <div className="text-sm text-muted-foreground uppercase">Total Utilizadores</div>
            </div>
            <Users className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-success">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success">{totalUsers - usersWithoutRoles}</div>
              <div className="text-sm text-muted-foreground uppercase">Com Roles</div>
            </div>
            <Shield className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-destructive">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-destructive">{usersWithoutRoles}</div>
              <div className="text-sm text-muted-foreground uppercase">Sem Roles</div>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">{roleStats.length}</div>
              <div className="text-sm text-muted-foreground uppercase">Roles Diferentes</div>
            </div>
            <TrendingUp className="h-8 w-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      {/* Gráfico de distribuição de roles */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Distribuição de Roles</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roleStats}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="role" 
              tickFormatter={(value) => roleLabels[value as AppRole]?.split(' ')[0] || value}
              className="text-muted-foreground"
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as RoleStats;
                  return (
                    <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
                      <p className="font-semibold mb-2">{roleLabels[data.role]}</p>
                      <p className="text-sm">Total: {data.count}</p>
                      <p className="text-xs text-muted-foreground">Manual: {data.manual}</p>
                      <p className="text-xs text-muted-foreground">Automática: {data.automatico}</p>
                      <p className="text-xs text-muted-foreground">Herdada: {data.herdado}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {roleStats.map((entry) => (
                <Cell key={entry.role} fill={COLORS[entry.role]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de atribuição */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Tipo de Atribuição</h3>
          </div>
          <div className="space-y-4">
            {tipoStats.map((stat) => (
              <div key={stat.tipo} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTipoIcon(stat.tipo)}
                    <span className="font-medium">{getTipoLabel(stat.tipo)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{stat.count}</span>
                    <Badge variant="secondary">{stat.percentage.toFixed(1)}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${stat.percentage}%`,
                      backgroundColor: TIPO_COLORS[stat.tipo as keyof typeof TIPO_COLORS] || "hsl(var(--primary))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top 5 Roles */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Roles Mais Atribuídas</h3>
          </div>
          <div className="space-y-3">
            {roleStats.slice(0, 5).map((stat, index) => (
              <div key={stat.role} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{roleLabels[stat.role]}</span>
                    <span className="text-sm text-muted-foreground">{stat.count} utilizadores</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${totalUsers > 0 ? (stat.count / totalUsers) * 100 : 0}%`,
                        backgroundColor: COLORS[stat.role],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
