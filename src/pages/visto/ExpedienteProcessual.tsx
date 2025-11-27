import { useState } from "react";
import { ArrowLeft, Plus, Filter, FileText, CheckCircle, Clock, XCircle, Eye, Trash2, Edit, RefreshCw } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { useExpedientesProcessuais } from "@/hooks/useExpedientesProcessuais";

interface ExpedienteProcessualProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ExpedienteProcessual = ({ onBack, onNavigate }: ExpedienteProcessualProps) => {
  const { expedientes, isLoading, updateExpediente, deleteExpediente } = useExpedientesProcessuais();
  const [expedienteSelecionado, setExpedienteSelecionado] = useState<any>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (id: string) => {
    const expediente = expedientes.find(e => e.id === id);
    if (expediente) {
      setExpedienteSelecionado(expediente);
      setDialogAberto(true);
    }
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await updateExpediente.mutateAsync({ id, status: newStatus });
      toast.success(`Estado do expediente alterado para: ${newStatus}`);
    } catch (error) {
      toast.error("Erro ao alterar o estado do expediente");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpediente.mutateAsync(id);
      toast.success("Expediente eliminado com sucesso!");
    } catch (error) {
      toast.error("Erro ao eliminar o expediente");
    }
  };

  const filteredExpedientes = expedientes.filter(exp => {
    if (searchTerm.length < 3) return true;
    const term = searchTerm.toLowerCase();
    return (
      exp.numero_expediente?.toLowerCase().includes(term) ||
      exp.assunto?.toLowerCase().includes(term) ||
      exp.origem?.toLowerCase().includes(term) ||
      exp.destino?.toLowerCase().includes(term)
    );
  });

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

  const getUrgenciaColor = (urgencia: string) => {
    return urgencia === "Urgente" ? "bg-destructive text-white" : "bg-muted";
  };

  const getStatusCount = (status: string) => {
    return expedientes.filter(e => e.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expediente Processual</h1>
            <p className="text-muted-foreground">Registo e gestão de expedientes de entrada</p>
          </div>
        </div>
        <Button onClick={() => onNavigate?.("novo-expediente-processual")} className="hover:scale-105 transition-transform">
          <Plus className="h-4 w-4 mr-2" />
          Novo Expediente
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expedientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{expedientes.length}</div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Validação</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-accent">{getStatusCount("Em Validação")}</div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Digitalização</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-primary">{getStatusCount("Digitalização")}</div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-success">{getStatusCount("Aprovado")}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Pesquisar por número, assunto ou entidade..."
                minCharacters={3}
              />
            </div>
            <Button variant="outline" className="hover:bg-accent/50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" size="icon" title="Actualizar lista" className="hover:bg-accent/50 transition-colors">
              <RefreshCw className="h-4 w-4" />
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
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Expediente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Data Entrada</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpedientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum expediente encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpedientes.map((exp) => (
                    <TableRow key={exp.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <TableCell className="font-medium">{exp.numero_expediente}</TableCell>
                      <TableCell>{exp.tipo_expediente}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{exp.assunto}</TableCell>
                      <TableCell>{exp.origem}</TableCell>
                      <TableCell>{exp.destino}</TableCell>
                      <TableCell>{exp.data_entrada ? new Date(exp.data_entrada).toLocaleDateString('pt-PT') : '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getUrgenciaColor(exp.urgencia)}>
                          {exp.urgencia}
                        </Badge>
                      </TableCell>
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
                            className="hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" title="Alterar estado" className="hover:bg-accent/50 transition-colors">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card">
                              <DropdownMenuLabel>Alterar Estado</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Em Validação")} className="cursor-pointer hover:bg-accent/50">
                                Em Validação
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Digitalização")} className="cursor-pointer hover:bg-accent/50">
                                Digitalização
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Aprovado")} className="cursor-pointer hover:bg-accent/50">
                                Aprovado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(exp.id, "Rejeitado")} className="cursor-pointer hover:bg-accent/50">
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
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem a certeza que deseja eliminar o expediente {exp.numero_expediente}? Esta acção não pode ser desfeita.
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {expedienteSelecionado && (
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Expediente {expedienteSelecionado.numero_expediente}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número</Label>
                  <p className="font-medium">{expedienteSelecionado.numero_expediente}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="font-medium">{expedienteSelecionado.tipo_expediente}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Assunto</Label>
                  <p className="font-medium">{expedienteSelecionado.assunto}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Origem</Label>
                  <p className="font-medium">{expedienteSelecionado.origem}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Destino</Label>
                  <p className="font-medium">{expedienteSelecionado.destino}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Entrada</Label>
                  <p className="font-medium">{expedienteSelecionado.data_entrada ? new Date(expedienteSelecionado.data_entrada).toLocaleDateString('pt-PT') : '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Urgência</Label>
                  <Badge className={getUrgenciaColor(expedienteSelecionado.urgencia)}>
                    {expedienteSelecionado.urgencia}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge className={getStatusColor(expedienteSelecionado.status)}>
                    {getStatusIcon(expedienteSelecionado.status)}
                    <span className="ml-1">{expedienteSelecionado.status}</span>
                  </Badge>
                </div>
                {expedienteSelecionado.observacoes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="font-medium">{expedienteSelecionado.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
