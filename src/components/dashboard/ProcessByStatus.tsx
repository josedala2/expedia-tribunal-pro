import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Análise Técnica", value: 145, color: "hsl(217, 91%, 60%)" },
  { name: "Validação", value: 98, color: "hsl(142, 71%, 45%)" },
  { name: "Decisão", value: 67, color: "hsl(262, 83%, 58%)" },
  { name: "Pendente", value: 32, color: "hsl(0, 84%, 60%)" },
];

export const ProcessByStatus = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Processos por Estado</CardTitle>
        <p className="text-sm text-muted-foreground">Distribuição atual</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
