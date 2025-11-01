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
      <CardHeader>
        <CardTitle className="text-foreground">Processos por Tipo</CardTitle>
        <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar dataKey="prestacao" name="Prestação de Contas" fill="hsl(var(--primary))" />
            <Bar dataKey="visto" name="Visto" fill="hsl(var(--accent))" />
            <Bar dataKey="fiscalizacao" name="Fiscalização" fill="hsl(var(--success))" />
            <Bar dataKey="multa" name="Multa" fill="hsl(var(--warning))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
