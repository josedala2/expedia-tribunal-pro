import { ArrowLeft, Plus, Search, Filter, FileText, CheckCircle, Clock, XCircle, Eye, Trash2, Edit } from "lucide-react";
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

interface ExpedientePrestacaoContasProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ExpedientePrestacaoContas = ({ onBack, onNavigate }: ExpedientePrestacaoContasProps) => {
  const handleView = (id: string) => {
    toast.info(`A visualizar expediente ${id}`);
    onNavigate?.("detalhe-prestacao");
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    toast.success(`Estado do expediente ${id} alterado para: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Expediente ${id} eliminado com sucesso!`);
  };

  const expedientes = [
    {
      id: "EXP-PC-2024-001",
      tipo: "Relatório Prestação de Contas",
      entidade: "Ministério da Educação",
      anoGerencia: "2023",
      dataEntrada: "15/03/2024",
      status: "Em Validação",
      responsavel: "Ana Silva",
      prazo: "30/06/2024"
    },
    {
      id: "EXP-PC-2024-002",
      tipo: "Documentação Complementar",
      entidade: "Governo Provincial de Luanda",
      anoGerencia: "2023",
      dataEntrada: "14/03/2024",
      status: "Digitalização",
      responsavel: "João Costa",
      prazo: "30/06/2024"
    },
    {
      id: "EXP-PC-2024-003",
      tipo: "Relatório Prestação de Contas",
      entidade: "Assembleia Nacional",
      anoGerencia: "2023",
      dataEntrada: "13/03/2024",
      status: "Aprovado",
      responsavel: "Maria Santos",
      prazo: "30/09/2024"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Em Validação":
      case "Digitalização":
        return <Clock className="h-4 w-4 text-accent" />;
      default:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-success text-white";
      case "Em Validação":
      case "Digitalização":
        return "bg-accent text-white";
      default:
        return "bg-destructive text-white";
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
            <h1 className="text-3xl font-bold text-foreground">Expediente de Prestação de Contas</h1>
            <p className="text-muted-foreground">Registo e gestão de expedientes de relatórios</p>
          </div>
        </div>
        <Button onClick={() => onNavigate?.("novo-expediente-prestacao")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Expediente
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expedientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">243</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Validação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Digitalização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">134</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número, entidade ou ano de gerência..."
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
          <CardTitle>Lista de Expedientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Expediente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ano Gerência</TableHead>
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
                      {exp.anoGerencia}
                    </Badge>
                  </TableCell>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(exp.id)}
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Em Validação")}>
                            Em Validação
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Digitalização")}>
                            Digitalização
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Aprovado")}>
                            Aprovado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Rejeitado")}>
                            Rejeitado
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
                              Tem certeza que deseja eliminar o expediente {exp.id}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(exp.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
