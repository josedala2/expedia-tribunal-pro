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
      <CardHeader className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 p-3 xs:p-4 sm:p-6">
        <div>
          <CardTitle className="text-foreground text-sm xs:text-base sm:text-lg">Processos Recentes</CardTitle>
          <p className="text-xs xs:text-sm text-muted-foreground mt-0.5 xs:mt-1">Últimas atualizações</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="quick-actions text-xs xs:text-sm h-8 xs:h-9 w-full xs:w-auto"
          onClick={() => onNavigate("processes")}
        >
          Ver Todos
          <ArrowRight className="ml-1.5 xs:ml-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-2 xs:p-3 sm:p-6 pt-0">
        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
          {recentProcesses.map((process) => (
            <div
              key={process.id}
              className="flex flex-col xs:flex-row xs:items-center justify-between p-2 xs:p-3 sm:p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer gap-2 xs:gap-3"
            >
              <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                <div className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-xs xs:text-sm">{process.id}</p>
                    <Badge variant="outline" className="text-[9px] xs:text-[10px] sm:text-xs px-1.5 xs:px-2">
                      {process.type}
                    </Badge>
                  </div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground truncate">{process.entity}</p>
                </div>
              </div>
              <div className="flex items-center justify-between xs:justify-end gap-2 xs:gap-3 sm:gap-4 pl-10 xs:pl-0">
                <div className="text-left xs:text-right">
                  <Badge className={`${statusColors[process.status]} text-[9px] xs:text-[10px] sm:text-xs px-1.5 xs:px-2`}>
                    {process.status}
                  </Badge>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs text-muted-foreground mt-0.5 xs:mt-1">{process.date}</p>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-secondary h-7 w-7 xs:h-8 xs:w-8">
                  <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
