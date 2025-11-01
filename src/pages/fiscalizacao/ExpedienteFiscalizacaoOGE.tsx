import { ArrowLeft, Plus, Search, Filter, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExpedienteFiscalizacaoOGEProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ExpedienteFiscalizacaoOGE = ({ onBack, onNavigate }: ExpedienteFiscalizacaoOGEProps) => {
  const expedientes = [
    {
      id: "EXP-OGE-2024-001",
      tipo: "Relatório Trimestral 1º Trimestre",
      entidade: "Ministério das Finanças",
      anoExercicio: "2024",
      trimestre: "1º Trimestre",
      dataEntrada: "15/05/2024",
      prazo: "14/05/2024",
      status: "No Prazo",
      responsavel: "Contadoria Geral"
    },
    {
      id: "EXP-OGE-2024-002",
      tipo: "Relatório Trimestral 4º Trimestre",
      entidade: "Ministério das Finanças",
      anoExercicio: "2023",
      trimestre: "4º Trimestre",
      dataEntrada: "20/02/2024",
      prazo: "14/02/2024",
      status: "Fora do Prazo",
      responsavel: "Contadoria Geral"
    },
    {
      id: "EXP-OGE-2024-003",
      tipo: "Documentação Complementar",
      entidade: "Assembleia Nacional",
      anoExercicio: "2024",
      trimestre: "1º Trimestre",
      dataEntrada: "10/05/2024",
      prazo: "14/05/2024",
      status: "No Prazo",
      responsavel: "Contadoria Geral"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "No Prazo":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Fora do Prazo":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-accent" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "No Prazo":
        return "bg-success text-white";
      case "Fora do Prazo":
        return "bg-destructive text-white";
      default:
        return "bg-accent text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expediente de Fiscalização OGE</h1>
            <p className="text-muted-foreground">Registo de relatórios trimestrais de execução orçamental (prazo: 45 dias)</p>
          </div>
        </div>
        <Button onClick={() => onNavigate?.("novo-expediente-fiscalizacao")}>
          <Plus className="h-4 w-4 mr-2" />
          Registar Relatório
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Relatórios 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">No Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">9</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fora do Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximo Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">14/08/2024</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número, ano ou trimestre..."
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Trimestrais Registados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Expediente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ano Exercício</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Data Entrada</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expedientes.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium">{exp.id}</TableCell>
                  <TableCell>{exp.tipo}</TableCell>
                  <TableCell>{exp.entidade}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {exp.anoExercicio}
                    </Badge>
                  </TableCell>
                  <TableCell>{exp.trimestre}</TableCell>
                  <TableCell>{exp.dataEntrada}</TableCell>
                  <TableCell>{exp.prazo}</TableCell>
                  <TableCell>{exp.responsavel}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(exp.status)}
                      <Badge variant="secondary" className={getStatusColor(exp.status)}>
                        {exp.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
