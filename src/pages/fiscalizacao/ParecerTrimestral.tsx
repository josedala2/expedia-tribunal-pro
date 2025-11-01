import { ArrowLeft, Plus, Search, Filter, FileCheck, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ParecerTrimestralProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ParecerTrimestral = ({ onBack, onNavigate }: ParecerTrimestralProps) => {
  const pareceres = [
    {
      id: "PAR-OGE-2024-001",
      processo: "FOGE-2024-001",
      anoExercicio: "2024",
      trimestre: "1º Trimestre",
      tipo: "Parecer Competente",
      responsavel: "3ª Divisão",
      dataEmissao: null,
      prazoEmissao: "30/06/2024",
      status: "Em Elaboração",
      conclusao: null
    },
    {
      id: "PAR-OGE-2023-004",
      processo: "FOGE-2023-004",
      anoExercicio: "2023",
      trimestre: "4º Trimestre",
      tipo: "Parecer Competente",
      responsavel: "3ª Divisão",
      dataEmissao: "15/03/2024",
      prazoEmissao: "30/03/2024",
      status: "Concluído",
      conclusao: "Em Conformidade"
    },
    {
      id: "PAR-OGE-2024-002",
      processo: "FOGE-2024-002",
      anoExercicio: "2024",
      trimestre: "1º Trimestre",
      tipo: "Resolução 2ª Câmara",
      responsavel: "Presidente 2ª Câmara",
      dataEmissao: "20/06/2024",
      prazoEmissao: "30/06/2024",
      status: "Concluído",
      conclusao: "Não Em Conformidade"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Em Elaboração":
        return <Clock className="h-4 w-4 text-accent" />;
      default:
        return <FileCheck className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-success text-white";
      case "Em Elaboração":
        return "bg-accent text-white";
      default:
        return "bg-primary text-white";
    }
  };

  const getConclusaoColor = (conclusao: string | null) => {
    if (!conclusao) return "bg-muted";
    return conclusao === "Em Conformidade" ? "bg-success text-white" : "bg-destructive text-white";
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
            <h1 className="text-3xl font-bold text-foreground">Parecer Trimestral OGE</h1>
            <p className="text-muted-foreground">Pareceres sobre execução orçamental enviados à Assembleia Nacional</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pareceres 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Elaboração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">6</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Não Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número, processo ou trimestre..."
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
          <CardTitle>Pareceres Trimestrais</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Parecer</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Conclusão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pareceres.map((parecer) => (
                <TableRow key={parecer.id}>
                  <TableCell className="font-medium">{parecer.id}</TableCell>
                  <TableCell>{parecer.processo}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {parecer.anoExercicio}
                    </Badge>
                  </TableCell>
                  <TableCell>{parecer.trimestre}</TableCell>
                  <TableCell>{parecer.tipo}</TableCell>
                  <TableCell>{parecer.responsavel}</TableCell>
                  <TableCell>{parecer.dataEmissao || "-"}</TableCell>
                  <TableCell>{parecer.prazoEmissao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(parecer.status)}
                      <Badge variant="secondary" className={getStatusColor(parecer.status)}>
                        {parecer.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {parecer.conclusao ? (
                      <Badge variant="secondary" className={getConclusaoColor(parecer.conclusao)}>
                        {parecer.conclusao}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
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
