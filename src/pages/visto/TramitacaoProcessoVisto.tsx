import { ArrowLeft, Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TramitacaoProcessoVistoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const TramitacaoProcessoVisto = ({ onBack, onNavigate }: TramitacaoProcessoVistoProps) => {
  const processos = [
    {
      id: "PV-2024-001",
      entidade: "Ministério da Saúde",
      valorContrato: "50.000.000,00 Kz",
      etapaAtual: "Análise Técnica",
      juizRelator: "Dr. António Ferreira",
      prazo: "30 dias",
      diasRestantes: 15,
      status: "Em Andamento"
    },
    {
      id: "PV-2024-002",
      entidade: "Instituto de Estradas",
      valorContrato: "120.000.000,00 Kz",
      etapaAtual: "Validação Chefe Divisão",
      juizRelator: "Dra. Maria Santos",
      prazo: "45 dias",
      diasRestantes: 8,
      status: "Em Andamento"
    },
    {
      id: "PV-2024-003",
      entidade: "Câmara Municipal",
      valorContrato: "25.000.000,00 Kz",
      etapaAtual: "Controle de Qualidade",
      juizRelator: "Dr. João Silva",
      prazo: "30 dias",
      diasRestantes: 22,
      status: "Em Andamento"
    },
  ];

  const getStatusColor = (diasRestantes: number) => {
    if (diasRestantes <= 5) return "bg-destructive text-white";
    if (diasRestantes <= 10) return "bg-accent text-white";
    return "bg-success text-white";
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
            <h1 className="text-3xl font-bold text-foreground">Tramitação do Processo Visto</h1>
            <p className="text-muted-foreground">Acompanhamento das etapas de tramitação</p>
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
            <div className="text-2xl font-bold text-foreground">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Análise Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Validação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prazo Crítico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">7</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número do processo, entidade ou juiz relator..."
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
          <CardTitle>Processos em Tramitação</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Valor Contrato</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Juiz Relator</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Dias Restantes</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell className="font-medium">{processo.id}</TableCell>
                  <TableCell>{processo.entidade}</TableCell>
                  <TableCell>{processo.valorContrato}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {processo.etapaAtual}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.juizRelator}</TableCell>
                  <TableCell>{processo.prazo}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(processo.diasRestantes)}>
                      {processo.diasRestantes} dias
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate?.("detalhe-visto")}
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
