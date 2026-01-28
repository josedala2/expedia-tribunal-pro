import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <div>
          <CardTitle className="text-foreground text-base sm:text-lg">Processos Recentes</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Últimas atualizações</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs sm:text-sm"
          onClick={() => onNavigate("processes")}
        >
          Ver Todos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs sm:text-sm">Processo</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm">Entidade</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm">Estado</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell">Data</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProcesses.map((process) => (
                <TableRow key={process.id} className="hover:bg-secondary/50 cursor-pointer">
                  <TableCell className="font-medium text-xs sm:text-sm py-3">{process.id}</TableCell>
                  <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {process.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm max-w-[150px] truncate">{process.entity}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[process.status]} text-xs`}>
                      {process.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                    {process.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onNavigate("processes")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
