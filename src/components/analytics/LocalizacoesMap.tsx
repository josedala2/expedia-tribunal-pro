import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface LocalizacoesMapProps {
  periodo: string;
}

export const LocalizacoesMap = ({ periodo }: LocalizacoesMapProps) => {
  const { data: localizacoes, isLoading } = useQuery({
    queryKey: ["localizacoes", periodo],
    queryFn: async () => {
      const dias = periodo === "24h" ? 1 : periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
      const dataInicio = subDays(new Date(), dias);

      const { data: logs, error } = await supabase
        .from("auth_logs")
        .select("ip_address, localizacao")
        .gte("criado_em", dataInicio.toISOString())
        .eq("evento", "login")
        .eq("sucesso", true);

      if (error) throw error;

      // Contar acessos por IP/localização
      const localizacoesCounts: Record<string, number> = {};

      logs?.forEach((log) => {
        const key = log.localizacao || log.ip_address || "Desconhecido";
        localizacoesCounts[key] = (localizacoesCounts[key] || 0) + 1;
      });

      // Ordenar por número de acessos
      return Object.entries(localizacoesCounts)
        .map(([localizacao, count]) => ({ localizacao, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  });

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">A carregar...</div>;
  }

  const total = localizacoes?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {localizacoes?.map((item, index) => {
          const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
          
          return (
            <div key={item.localizacao} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium truncate">{item.localizacao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.count} acessos</Badge>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {(!localizacoes || localizacoes.length === 0) && (
        <p className="text-center text-muted-foreground py-8">
          Sem dados de localização disponíveis
        </p>
      )}

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          <strong>Nota:</strong> As localizações são determinadas pelo endereço IP registado no momento do acesso.
        </p>
      </div>
    </div>
  );
};
