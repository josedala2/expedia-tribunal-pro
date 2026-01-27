import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", prestacao: 45, visto: 32, fiscalizacao: 18, multa: 12 },
  { month: "Fev", prestacao: 52, visto: 38, fiscalizacao: 22, multa: 15 },
  { month: "Mar", prestacao: 48, visto: 42, fiscalizacao: 25, multa: 18 },
  { month: "Abr", prestacao: 61, visto: 45, fiscalizacao: 28, multa: 20 },
  { month: "Mai", prestacao: 55, visto: 48, fiscalizacao: 30, multa: 22 },
  { month: "Jun", prestacao: 67, visto: 52, fiscalizacao: 35, multa: 25 },
];

export const ProcessChart = () => {
  return (
    <Card className="border-border">
      <CardHeader className="p-3 xs:p-4 sm:p-6">
        <CardTitle className="text-foreground text-sm xs:text-base sm:text-lg">Processos por Tipo</CardTitle>
        <p className="text-xs xs:text-sm text-muted-foreground">Últimos 6 meses</p>
      </CardHeader>
      <CardContent className="p-2 xs:p-3 sm:p-6 pt-0">
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-muted-foreground" tick={{ fontSize: 10 }} />
            <YAxis className="text-muted-foreground" tick={{ fontSize: 10 }} width={35} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="prestacao" name="Prestação" fill="hsl(217, 91%, 60%)" />
            <Bar dataKey="visto" name="Visto" fill="hsl(142, 71%, 45%)" />
            <Bar dataKey="fiscalizacao" name="Fiscalização" fill="hsl(262, 83%, 58%)" />
            <Bar dataKey="multa" name="Multa" fill="hsl(0, 84%, 60%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
