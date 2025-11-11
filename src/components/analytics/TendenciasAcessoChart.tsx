import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";
import { pt } from "date-fns/locale";

interface TendenciasAcessoChartProps {
  periodo: string;
}

export const TendenciasAcessoChart = ({ periodo }: TendenciasAcessoChartProps) => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["tendencias-acesso", periodo],
    queryFn: async () => {
      const dias = periodo === "24h" ? 1 : periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
      const dataInicio = subDays(new Date(), dias);

      const { data: logs, error } = await supabase
        .from("auth_logs")
        .select("criado_em, sucesso, evento")
        .gte("criado_em", dataInicio.toISOString())
        .eq("evento", "login");

      if (error) throw error;

      // Criar array com todos os dias do período
      const interval = eachDayOfInterval({ start: dataInicio, end: new Date() });
      
      const dadosPorDia = interval.map((dia) => {
        const diaStr = format(startOfDay(dia), "yyyy-MM-dd");
        const logsDoDia = logs?.filter((log) => 
          format(startOfDay(new Date(log.criado_em)), "yyyy-MM-dd") === diaStr
        ) || [];

        return {
          data: format(dia, "dd/MM", { locale: pt }),
          total: logsDoDia.length,
          sucesso: logsDoDia.filter((l) => l.sucesso).length,
          falha: logsDoDia.filter((l) => !l.sucesso).length,
        };
      });

      return dadosPorDia;
    },
  });

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">A carregar...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="data" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#8b5cf6" name="Total" strokeWidth={2} />
        <Line type="monotone" dataKey="sucesso" stroke="#10b981" name="Sucesso" strokeWidth={2} />
        <Line type="monotone" dataKey="falha" stroke="#ef4444" name="Falha" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
