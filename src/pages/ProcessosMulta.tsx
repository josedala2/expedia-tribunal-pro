import { ArrowLeft, Plus, Search, Filter, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProcessosMultaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ProcessosMulta = ({ onBack, onNavigate }: ProcessosMultaProps) => {
  const processos = [
    { numero: "PM/2024/001", entidade: "Empresa Municipal X", infracoes: "Irregularidades Contabilísticas", valor: "5.000.000 Kz", status: "Notificado" },
    { numero: "PM/2024/002", entidade: "Instituto Y", infracoes: "Atraso na Prestação de Contas", valor: "2.500.000 Kz", status: "Em Análise" },
    { numero: "PM/2024/003", entidade: "Fundação Z", infracoes: "Desvio de Fundos", valor: "15.000.000 Kz", status: "Pago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              Processos Autónomos de Multa
            </h1>
            <p className="text-muted-foreground">Gestão de processos sancionatórios e aplicação de multas</p>
          </div>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          onClick={() => onNavigate?.("novo-processo-multa")}
        >
          <Plus className="h-5 w-5" />
          Novo Processo Autónomo de Multa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">10</div>
          <div className="text-sm text-muted-foreground uppercase">Notificados</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">7</div>
          <div className="text-sm text-muted-foreground uppercase">Em Análise</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">28</div>
          <div className="text-sm text-muted-foreground uppercase">Pagos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-destructive">
          <div className="text-2xl font-bold text-destructive">5</div>
          <div className="text-sm text-muted-foreground uppercase">Em Cobrança</div>
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
              <TableHead>Infrações</TableHead>
              <TableHead>Valor da Multa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.numero}>
                <TableCell className="font-medium">{processo.numero}</TableCell>
                <TableCell>{processo.entidade}</TableCell>
                <TableCell>{processo.infracoes}</TableCell>
                <TableCell className="font-bold text-destructive">{processo.valor}</TableCell>
                <TableCell>
                  <Badge 
                    variant={processo.status === "Pago" ? "default" : "secondary"}
                    className={processo.status === "Pago" ? "bg-success" : ""}
                  >
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-accent border-accent hover:bg-accent/10"
                    onClick={() => onNavigate?.("detalhe-multa")}
                  >
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
