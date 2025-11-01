import { ArrowLeft, Search, Filter, Send, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SaidaExpedienteFiscalizacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const SaidaExpedienteFiscalizacao = ({ onBack, onNavigate }: SaidaExpedienteFiscalizacaoProps) => {
  const saidas = [
    {
      id: "SE-FOGE-2024-001",
      processo: "FOGE-2024-001",
      tipo: "Notificação Parecer à AN",
      destinatario: "Assembleia Nacional",
      documento: "Parecer Trimestral",
      trimestre: "1º Trimestre 2024",
      dataCriacao: "25/06/2024",
      dataEnvio: "26/06/2024",
      status: "Enviado",
      responsavel: "CG"
    },
    {
      id: "SE-FOGE-2024-002",
      processo: "FOGE-2024-001",
      tipo: "Solicitação Elementos",
      destinatario: "Ministério das Finanças",
      documento: "Ofício",
      trimestre: "1º Trimestre 2024",
      dataCriacao: "20/06/2024",
      dataEnvio: null,
      status: "Pendente Assinatura",
      responsavel: "3ª Divisão"
    },
    {
      id: "SE-FOGE-2023-004",
      processo: "FOGE-2023-004",
      tipo: "Notificação Parecer à AN",
      destinatario: "Assembleia Nacional",
      documento: "Parecer Trimestral",
      trimestre: "4º Trimestre 2023",
      dataCriacao: "15/03/2024",
      dataEnvio: "16/03/2024",
      status: "Enviado",
      responsavel: "CG"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Enviado":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Pendente Assinatura":
        return <Clock className="h-4 w-4 text-accent" />;
      default:
        return <Send className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviado":
        return "bg-success text-white";
      case "Pendente Assinatura":
        return "bg-accent text-white";
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
            <h1 className="text-3xl font-bold text-foreground">Saída de Expediente - Fiscalização OGE</h1>
            <p className="text-muted-foreground">Notificações de pareceres e correspondências</p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expedientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">56</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pareceres à AN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">16</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">44</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número, processo ou destinatário..."
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
          <CardTitle>Expedientes de Saída</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Saída</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Data Envio</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saidas.map((saida) => (
                <TableRow key={saida.id}>
                  <TableCell className="font-medium">{saida.id}</TableCell>
                  <TableCell>{saida.processo}</TableCell>
                  <TableCell>{saida.tipo}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {saida.destinatario}
                    </Badge>
                  </TableCell>
                  <TableCell>{saida.documento}</TableCell>
                  <TableCell>{saida.trimestre}</TableCell>
                  <TableCell>{saida.dataCriacao}</TableCell>
                  <TableCell>{saida.dataEnvio || "-"}</TableCell>
                  <TableCell>{saida.responsavel}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(saida.status)}
                      <Badge variant="secondary" className={getStatusColor(saida.status)}>
                        {saida.status}
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
