import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText } from "lucide-react";

interface RecentProcessesProps {
  onNavigate: (view: string) => void;
}

const recentProcesses = [
  {
    id: "PC-2025-001",
    type: "Prestação de Contas",
    entity: "Ministério da Educação",
    status: "Em Análise",
    date: "2025-03-15",
    priority: "high",
  },
  {
    id: "VS-2025-042",
    type: "Visto",
    entity: "Governo Provincial de Luanda",
    status: "Validação",
    date: "2025-03-14",
    priority: "medium",
  },
  {
    id: "FI-2025-018",
    type: "Fiscalização OGE",
    entity: "Ministério das Finanças",
    status: "Decisão",
    date: "2025-03-13",
    priority: "high",
  },
  {
    id: "ML-2025-008",
    type: "Multa",
    entity: "Empresa Pública XYZ",
    status: "Pendente",
    date: "2025-03-12",
    priority: "low",
  },
];

const statusColors: Record<string, string> = {
  "Em Análise": "bg-primary/10 text-primary border-primary/20",
  "Validação": "bg-warning/10 text-warning border-warning/20",
  "Decisão": "bg-accent/10 text-accent border-accent/20",
  "Pendente": "bg-destructive/10 text-destructive border-destructive/20",
};

export const RecentProcesses = ({ onNavigate }: RecentProcessesProps) => {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Processos Recentes</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Últimas atualizações</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate("processes")}
        >
          Ver Todos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProcesses.map((process) => (
            <div
              key={process.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{process.id}</p>
                    <Badge variant="outline" className="text-xs">
                      {process.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{process.entity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge className={statusColors[process.status]}>
                    {process.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{process.date}</p>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
