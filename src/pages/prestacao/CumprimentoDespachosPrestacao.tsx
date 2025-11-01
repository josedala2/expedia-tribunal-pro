import { ArrowLeft, Search, Filter, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CumprimentoDespachosPrestacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const CumprimentoDespachosPrestacao = ({ onBack, onNavigate }: CumprimentoDespachosPrestacaoProps) => {
  const despachos = [
    {
      id: "DES-PC-2024-001",
      processo: "PC-2024-001",
      tipo: "Elaboração Guia Cobrança",
      entidade: "Ministério da Educação",
      dataDespacho: "10/03/2024",
      prazoResposta: "20/03/2024",
      responsavel: "CG-SCE",
      status: "Pendente"
    },
    {
      id: "DES-PC-2024-002",
      processo: "PC-2024-002",
      tipo: "Notificação MP",
      entidade: "Governo Provincial de Luanda",
      dataDespacho: "08/03/2024",
      prazoResposta: "15/03/2024",
      responsavel: "CG-SFS",
      status: "Em Andamento"
    },
    {
      id: "DES-PC-2024-003",
      processo: "PC-2024-003",
      tipo: "Ofício de Remessa",
      entidade: "Assembleia Nacional",
      dataDespacho: "05/03/2024",
      prazoResposta: "12/03/2024",
      responsavel: "CG-SFS",
      status: "Concluído"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Em Andamento":
        return <Clock className="h-4 w-4 text-accent" />;
      case "Pendente":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-success text-white";
      case "Em Andamento":
        return "bg-accent text-white";
      case "Pendente":
        return "bg-destructive text-white";
      default:
        return "bg-muted";
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
            <h1 className="text-3xl font-bold text-foreground">Cumprimento de Despachos - Prestação de Contas</h1>
            <p className="text-muted-foreground">Gestão e acompanhamento de despachos pela Contadoria Geral</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Despachos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">28</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">32</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número de despacho, processo ou entidade..."
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
          <CardTitle>Despachos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Despacho</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Data Despacho</TableHead>
                <TableHead>Prazo Resposta</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {despachos.map((despacho) => (
                <TableRow key={despacho.id}>
                  <TableCell className="font-medium">{despacho.id}</TableCell>
                  <TableCell>{despacho.processo}</TableCell>
                  <TableCell>{despacho.tipo}</TableCell>
                  <TableCell>{despacho.entidade}</TableCell>
                  <TableCell>{despacho.dataDespacho}</TableCell>
                  <TableCell>{despacho.prazoResposta}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {despacho.responsavel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(despacho.status)}
                      <Badge variant="secondary" className={getStatusColor(despacho.status)}>
                        {despacho.status}
                      </Badge>
                    </div>
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
