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
      <CardHeader className="p-3 xs:p-4 sm:p-6">
        <CardTitle className="text-foreground text-sm xs:text-base sm:text-lg">Processos por Estado</CardTitle>
        <p className="text-xs xs:text-sm text-muted-foreground">Distribuição atual</p>
      </CardHeader>
      <CardContent className="p-2 xs:p-3 sm:p-6 pt-0">
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px] md:!h-[300px]">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius="70%"
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
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
