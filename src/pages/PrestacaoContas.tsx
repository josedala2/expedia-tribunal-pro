import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PrestacaoContasProps {
  onBack: () => void;
}

export const PrestacaoContas = ({ onBack }: PrestacaoContasProps) => {
  const processos = [
    { numero: "PC/2024/001", entidade: "Ministério da Educação", exercicio: "2023", status: "Em Análise", prazo: "30 dias" },
    { numero: "PC/2024/002", entidade: "Governação Provincial de Luanda", exercicio: "2023", status: "Pendente", prazo: "45 dias" },
    { numero: "PC/2024/003", entidade: "Instituto Nacional de Estatística", exercicio: "2023", status: "Aprovado", prazo: "Concluído" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prestação de Contas</h1>
            <p className="text-muted-foreground">Gestão de processos de prestação de contas</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2">
          <Plus className="h-5 w-5" />
          Novo Processo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">24</div>
          <div className="text-sm text-muted-foreground uppercase">Em Análise</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">12</div>
          <div className="text-sm text-muted-foreground uppercase">Pendentes</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">45</div>
          <div className="text-sm text-muted-foreground uppercase">Aprovados</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-destructive">
          <div className="text-2xl font-bold text-destructive">8</div>
          <div className="text-sm text-muted-foreground uppercase">Rejeitados</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por número ou entidade..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Processo</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Exercício</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.numero}>
                <TableCell className="font-medium">{processo.numero}</TableCell>
                <TableCell>{processo.entidade}</TableCell>
                <TableCell>{processo.exercicio}</TableCell>
                <TableCell>
                  <Badge 
                    variant={processo.status === "Aprovado" ? "default" : "secondary"}
                    className={processo.status === "Aprovado" ? "bg-success" : ""}
                  >
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>{processo.prazo}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="text-accent border-accent hover:bg-accent/10">
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
