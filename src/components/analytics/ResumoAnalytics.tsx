import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Clock, Globe, Zap } from "lucide-react";
import { subDays } from "date-fns";

interface ResumoAnalyticsProps {
  periodo: string;
}

export const ResumoAnalytics = ({ periodo }: ResumoAnalyticsProps) => {
  const { data: stats } = useQuery({
    queryKey: ["resumo-analytics", periodo],
    queryFn: async () => {
      const dias = periodo === "24h" ? 1 : periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
      const dataInicio = subDays(new Date(), dias);
      const periodoAnterior = subDays(dataInicio, dias);

      // Período actual
      const { data: logsActual } = await supabase
        .from("auth_logs")
        .select("*")
        .gte("criado_em", dataInicio.toISOString())
        .eq("evento", "login");

      // Período anterior para comparação
      const { data: logsAnterior } = await supabase
        .from("auth_logs")
        .select("*")
        .gte("criado_em", periodoAnterior.toISOString())
        .lt("criado_em", dataInicio.toISOString())
        .eq("evento", "login");

      // Utilizadores únicos
      const utilizadoresUnicos = new Set(
        logsActual?.filter((l) => l.sucesso).map((l) => l.user_id)
      ).size;

      const utilizadoresUnicosAnterior = new Set(
        logsAnterior?.filter((l) => l.sucesso).map((l) => l.user_id)
      ).size;

      // Média de logins por dia
      const totalLogins = logsActual?.filter((l) => l.sucesso).length || 0;
      const mediaPorDia = totalLogins / dias;

      const totalLoginsAnterior = logsAnterior?.filter((l) => l.sucesso).length || 0;
      const mediaPorDiaAnterior = totalLoginsAnterior / dias;

      // Taxa de sucesso
      const totalTentativas = logsActual?.length || 0;
      const taxaSucesso = totalTentativas > 0 ? (totalLogins / totalTentativas) * 100 : 0;

      const totalTentativasAnterior = logsAnterior?.length || 0;
      const taxaSucessoAnterior =
        totalTentativasAnterior > 0 ? (totalLoginsAnterior / totalTentativasAnterior) * 100 : 0;

      // IPs únicos
      const ipsUnicos = new Set(logsActual?.map((l) => l.ip_address).filter(Boolean)).size;

      const calcularVariacao = (actual: number, anterior: number) => {
        if (anterior === 0) return actual > 0 ? 100 : 0;
        return ((actual - anterior) / anterior) * 100;
      };

      return {
        utilizadoresUnicos,
        variacaoUtilizadores: calcularVariacao(utilizadoresUnicos, utilizadoresUnicosAnterior),
        mediaPorDia: mediaPorDia.toFixed(1),
        variacaoMedia: calcularVariacao(mediaPorDia, mediaPorDiaAnterior),
        taxaSucesso: taxaSucesso.toFixed(1),
        variacaoTaxa: calcularVariacao(taxaSucesso, taxaSucessoAnterior),
        ipsUnicos,
      };
    },
    refetchInterval: 60000, // Actualizar a cada minuto
  });

  const renderVariacao = (variacao: number) => {
    const isPositive = variacao >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? "text-success" : "text-destructive";

    return (
      <div className={`flex items-center gap-1 text-sm ${color}`}>
        <Icon className="h-4 w-4" />
        <span>{Math.abs(variacao).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Utilizadores Únicos</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats?.utilizadoresUnicos || 0}
            </p>
            {stats?.variacaoUtilizadores !== undefined && (
              <div className="mt-2">{renderVariacao(stats.variacaoUtilizadores)}</div>
            )}
          </div>
          <Users className="h-8 w-8 text-primary opacity-50" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Média por Dia</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.mediaPorDia || "0"}</p>
            {stats?.variacaoMedia !== undefined && (
              <div className="mt-2">{renderVariacao(stats.variacaoMedia)}</div>
            )}
          </div>
          <Clock className="h-8 w-8 text-accent opacity-50" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Taxa de Sucesso</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.taxaSucesso || "0"}%</p>
            {stats?.variacaoTaxa !== undefined && (
              <div className="mt-2">{renderVariacao(stats.variacaoTaxa)}</div>
            )}
          </div>
          <Zap className="h-8 w-8 text-success opacity-50" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">IPs Únicos</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.ipsUnicos || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">Localizações diferentes</p>
          </div>
          <Globe className="h-8 w-8 text-secondary opacity-50" />
        </div>
      </Card>
    </div>
  );
};
