import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Users, Activity } from "lucide-react";

export const EstatisticasSeguranca = () => {
  const { data: stats } = useQuery({
    queryKey: ["auth-stats"],
    queryFn: async () => {
      // Últimas 24 horas
      const umDiaAtras = new Date();
      umDiaAtras.setDate(umDiaAtras.getDate() - 1);

      // Total de tentativas de login nas últimas 24h
      const { count: totalLogins } = await supabase
        .from("auth_logs")
        .select("*", { count: "exact", head: true })
        .eq("evento", "login")
        .gte("criado_em", umDiaAtras.toISOString());

      // Logins bem sucedidos
      const { count: loginsSuccesso } = await supabase
        .from("auth_logs")
        .select("*", { count: "exact", head: true })
        .eq("evento", "login")
        .eq("sucesso", true)
        .gte("criado_em", umDiaAtras.toISOString());

      // Logins falhados
      const { count: loginsFalha } = await supabase
        .from("auth_logs")
        .select("*", { count: "exact", head: true })
        .eq("evento", "login")
        .eq("sucesso", false)
        .gte("criado_em", umDiaAtras.toISOString());

      // Sessões activas
      const { count: sessoesActivas } = await supabase
        .from("sessoes_activas")
        .select("*", { count: "exact", head: true })
        .eq("activa", true);

      return {
        totalLogins: totalLogins || 0,
        loginsSuccesso: loginsSuccesso || 0,
        loginsFalha: loginsFalha || 0,
        sessoesActivas: sessoesActivas || 0,
      };
    },
    refetchInterval: 30000, // Actualizar a cada 30 segundos
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Logins (24h)</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats?.totalLogins || 0}
            </p>
          </div>
          <Activity className="h-8 w-8 text-primary opacity-50" />
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-success">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Bem Sucedidos</p>
            <p className="text-2xl font-bold text-success mt-1">
              {stats?.loginsSuccesso || 0}
            </p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-success opacity-50" />
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-destructive">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Falhados</p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {stats?.loginsFalha || 0}
            </p>
          </div>
          <XCircle className="h-8 w-8 text-destructive opacity-50" />
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-accent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase">Sessões Activas</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats?.sessoesActivas || 0}
            </p>
          </div>
          <Users className="h-8 w-8 text-accent opacity-50" />
        </div>
      </Card>
    </div>
  );
};
