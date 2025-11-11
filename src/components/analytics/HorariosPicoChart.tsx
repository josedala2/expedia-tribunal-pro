import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { subDays } from "date-fns";

interface HorariosPicoChartProps {
  periodo: string;
}

export const HorariosPicoChart = ({ periodo }: HorariosPicoChartProps) => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["horarios-pico", periodo],
    queryFn: async () => {
      const dias = periodo === "24h" ? 1 : periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
      const dataInicio = subDays(new Date(), dias);

      const { data: logs, error } = await supabase
        .from("auth_logs")
        .select("criado_em, sucesso")
        .gte("criado_em", dataInicio.toISOString())
        .eq("evento", "login");

      if (error) throw error;

      // Agrupar por hora do dia (0-23)
      const dadosPorHora = Array.from({ length: 24 }, (_, hora) => {
        const logsDaHora = logs?.filter((log) => {
          const horaLog = new Date(log.criado_em).getHours();
          return horaLog === hora;
        }) || [];

        return {
          hora: `${hora.toString().padStart(2, "0")}:00`,
          total: logsDaHora.length,
          sucesso: logsDaHora.filter((l) => l.sucesso).length,
          falha: logsDaHora.filter((l) => !l.sucesso).length,
        };
      });

      return dadosPorHora;
    },
  });

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">A carregar...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hora" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sucesso" fill="#10b981" name="Sucesso" />
        <Bar dataKey="falha" fill="#ef4444" name="Falha" />
      </BarChart>
    </ResponsiveContainer>
  );
};
