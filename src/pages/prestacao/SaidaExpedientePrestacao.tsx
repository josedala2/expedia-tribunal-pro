import { ArrowLeft, Search, Filter, Send, FileText, CheckCircle, Clock, Eye, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SaidaExpedientePrestacaoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const SaidaExpedientePrestacao = ({ onBack, onNavigate }: SaidaExpedientePrestacaoProps) => {
  const handleView = (id: string) => {
    toast.info(`A visualizar expediente ${id}`);
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    toast.success(`Estado do expediente ${id} alterado para: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Expediente ${id} eliminado com sucesso!`);
  };

  const saidas = [
    {
      id: "SE-PC-2024-001",
      processo: "PC-2024-001",
      tipo: "Notificação Decisão",
      destinatario: "Ministério da Educação",
      documento: "Ofício de Remessa",
      dataCriacao: "15/03/2024",
      dataEnvio: "16/03/2024",
      status: "Enviado",
      responsavel: "Oficial de Diligências"
    },
    {
      id: "SE-PC-2024-002",
      processo: "PC-2024-002",
      tipo: "Solicitação Elementos",
      destinatario: "Governo Provincial de Luanda",
      documento: "Ofício",
      dataCriacao: "14/03/2024",
      dataEnvio: null,
      status: "Pendente Assinatura",
      responsavel: "Juiz Relator"
    },
    {
      id: "SE-PC-2024-003",
      processo: "PC-2024-003",
      tipo: "Guia de Cobrança",
      destinatario: "Assembleia Nacional",
      documento: "Guia + Ofício",
      dataCriacao: "13/03/2024",
      dataEnvio: "14/03/2024",
      status: "Enviado",
      responsavel: "CG-SCE"
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
            <h1 className="text-3xl font-bold text-foreground">Saída de Expediente - Prestação de Contas</h1>
            <p className="text-muted-foreground">Gestão de notificações e correspondências</p>
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
            <div className="text-2xl font-bold text-foreground">186</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">22</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">116</div>
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
                  <TableCell>{saida.destinatario}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {saida.documento}
                    </Badge>
                  </TableCell>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(saida.id)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" title="Alterar estado">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card">
                          <DropdownMenuLabel>Alterar Estado</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleChangeStatus(saida.id, "Pendente Assinatura")}>
                            Pendente Assinatura
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(saida.id, "Enviado")}>
                            Enviado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="Eliminar"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja eliminar o expediente {saida.id}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(saida.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
