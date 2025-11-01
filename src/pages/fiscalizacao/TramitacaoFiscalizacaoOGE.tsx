import { ArrowLeft, Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TramitacaoFiscalizacaoOGEProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const TramitacaoFiscalizacaoOGE = ({ onBack, onNavigate }: TramitacaoFiscalizacaoOGEProps) => {
  const processos = [
    {
      id: "FOGE-2024-001",
      anoExercicio: "2024",
      trimestre: "1º Trimestre",
      etapaAtual: "Parecer Competente",
      divisao: "3ª Divisão",
      juizRelator: "Dr. Presidente 2ª Câmara",
      dataInicio: "15/05/2024",
      status: "Em Termos"
    },
    {
      id: "FOGE-2023-004",
      anoExercicio: "2023",
      trimestre: "4º Trimestre",
      etapaAtual: "Controle de Qualidade",
      divisao: "3ª Divisão",
      juizRelator: "Dr. Presidente 2ª Câmara",
      dataInicio: "20/02/2024",
      status: "Em Termos"
    },
    {
      id: "FOGE-2024-002",
      anoExercicio: "2024",
      trimestre: "1º Trimestre",
      etapaAtual: "Resolução",
      divisao: "2ª Câmara",
      juizRelator: "Dr. Presidente 2ª Câmara",
      dataInicio: "10/05/2024",
      status: "Em Termos"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tramitação de Fiscalização OGE</h1>
            <p className="text-muted-foreground">Acompanhamento da fiscalização da execução orçamental</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Apreciação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Parecer Competente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Controle Qualidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">6</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Resolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">4</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número do processo, ano ou trimestre..."
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
          <CardTitle>Processos de Fiscalização OGE em Tramitação</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Ano Exercício</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Divisão/Câmara</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell className="font-medium">{processo.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {processo.anoExercicio}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.trimestre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-accent text-white">
                      {processo.etapaAtual}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.divisao}</TableCell>
                  <TableCell>{processo.juizRelator}</TableCell>
                  <TableCell>{processo.dataInicio}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-success text-white">
                      {processo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate?.("detalhe-fiscalizacao")}
                    >
                      <Eye className="h-4 w-4" />
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
