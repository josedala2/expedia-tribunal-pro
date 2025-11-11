import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { subDays } from "date-fns";

interface DispositivosChartProps {
  periodo: string;
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

export const DispositivosChart = ({ periodo }: DispositivosChartProps) => {
  const { data: dispositivosData, isLoading: isLoadingDispositivos } = useQuery({
    queryKey: ["dispositivos-chart", periodo],
    queryFn: async () => {
      const dias = periodo === "24h" ? 1 : periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
      const dataInicio = subDays(new Date(), dias);

      const { data: logs, error } = await supabase
        .from("auth_logs")
        .select("user_agent")
        .gte("criado_em", dataInicio.toISOString())
        .eq("evento", "login")
        .eq("sucesso", true);

      if (error) throw error;

      const dispositivosCounts: Record<string, number> = {};

      logs?.forEach((log) => {
        const ua = log.user_agent?.toLowerCase() || "";
        let dispositivo = "Outro";

        if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
          dispositivo = "Mobile";
        } else if (ua.includes("tablet") || ua.includes("ipad")) {
          dispositivo = "Tablet";
        } else {
          dispositivo = "Desktop";
        }

        dispositivosCounts[dispositivo] = (dispositivosCounts[dispositivo] || 0) + 1;
      });

      return Object.entries(dispositivosCounts).map(([name, value]) => ({ name, value }));
    },
  });

  const { data: navegadoresData, isLoading: isLoadingNavegadores } = useQuery({
    queryKey: ["navegadores-chart", periodo],
    queryFn: async () => {
      const dias = periodo === "24h" ? 1 : periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
      const dataInicio = subDays(new Date(), dias);

      const { data: logs, error } = await supabase
        .from("auth_logs")
        .select("user_agent")
        .gte("criado_em", dataInicio.toISOString())
        .eq("evento", "login")
        .eq("sucesso", true);

      if (error) throw error;

      const navegadoresCounts: Record<string, number> = {};

      logs?.forEach((log) => {
        const ua = log.user_agent || "";
        let navegador = "Outro";

        if (ua.includes("Chrome") && !ua.includes("Edge")) {
          navegador = "Chrome";
        } else if (ua.includes("Firefox")) {
          navegador = "Firefox";
        } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
          navegador = "Safari";
        } else if (ua.includes("Edge")) {
          navegador = "Edge";
        }

        navegadoresCounts[navegador] = (navegadoresCounts[navegador] || 0) + 1;
      });

      return Object.entries(navegadoresCounts).map(([name, value]) => ({ name, value }));
    },
  });

  if (isLoadingDispositivos || isLoadingNavegadores) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">A carregar...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Tipo de Dispositivo</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={dispositivosData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {dispositivosData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Navegadores</h4>
        <div className="space-y-2">
          {navegadoresData?.map((item, index) => {
            const total = navegadoresData.reduce((sum, i) => sum + i.value, 0);
            const percentage = ((item.value / total) * 100).toFixed(1);
            
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
