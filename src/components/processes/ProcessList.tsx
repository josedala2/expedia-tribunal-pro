import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcessListProps {
  onViewProcess: (processId: string) => void;
}

const processes = [
  {
    id: "PC-2025-001",
    type: "Prestação de Contas",
    entity: "Ministério da Educação",
    status: "Em Análise",
    currentStage: "Análise Técnica",
    responsible: "João Silva",
    date: "2025-03-15",
    priority: "Alta",
  },
  {
    id: "VS-2025-042",
    type: "Visto",
    entity: "Governo Provincial de Luanda",
    status: "Validação",
    currentStage: "Validação Chefe Divisão",
    responsible: "Maria Santos",
    date: "2025-03-14",
    priority: "Média",
  },
  {
    id: "FI-2025-018",
    type: "Fiscalização OGE",
    entity: "Ministério das Finanças",
    status: "Decisão",
    currentStage: "Decisão Final",
    responsible: "António Costa",
    date: "2025-03-13",
    priority: "Alta",
  },
  {
    id: "PC-2025-002",
    type: "Prestação de Contas Soberania",
    entity: "Assembleia Nacional",
    status: "Em Análise",
    currentStage: "Controle de Qualidade",
    responsible: "Teresa Alves",
    date: "2025-03-12",
    priority: "Alta",
  },
  {
    id: "ML-2025-008",
    type: "Multa",
    entity: "Empresa Pública XYZ",
    status: "Pendente",
    currentStage: "Registo de Entrada",
    responsible: "Carlos Mendes",
    date: "2025-03-11",
    priority: "Baixa",
  },
];

const statusColors: Record<string, string> = {
  "Em Análise": "bg-primary/10 text-primary border-primary/20",
  "Validação": "bg-warning/10 text-warning border-warning/20",
  "Decisão": "bg-accent/10 text-accent border-accent/20",
  "Pendente": "bg-destructive/10 text-destructive border-destructive/20",
  "Concluído": "bg-success/10 text-success border-success/20",
};

const priorityColors: Record<string, string> = {
  "Alta": "bg-destructive/10 text-destructive border-destructive/20",
  "Média": "bg-warning/10 text-warning border-warning/20",
  "Baixa": "bg-muted text-muted-foreground border-border",
};

export const ProcessList = ({ onViewProcess }: ProcessListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gestão de Processos</h2>
        <p className="text-muted-foreground mt-1">Visualize e gerencie todos os processos</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-foreground">Lista de Processos</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar processo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="prestacao">Prestação de Contas</SelectItem>
                  <SelectItem value="visto">Visto</SelectItem>
                  <SelectItem value="fiscalizacao">Fiscalização</SelectItem>
                  <SelectItem value="multa">Multa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="analise">Em Análise</SelectItem>
                  <SelectItem value="validacao">Validação</SelectItem>
                  <SelectItem value="decisao">Decisão</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Processo</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Entidade</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Etapa Atual</TableHead>
                  <TableHead className="font-semibold">Responsável</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Prioridade</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process) => (
                  <TableRow key={process.id} className="hover:bg-secondary/50">
                    <TableCell className="font-medium">{process.id}</TableCell>
                    <TableCell className="text-sm">{process.type}</TableCell>
                    <TableCell className="text-sm">{process.entity}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[process.status]}>
                        {process.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{process.currentStage}</TableCell>
                    <TableCell className="text-sm">{process.responsible}</TableCell>
                    <TableCell className="text-sm">{process.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityColors[process.priority]}>
                        {process.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProcess(process.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
