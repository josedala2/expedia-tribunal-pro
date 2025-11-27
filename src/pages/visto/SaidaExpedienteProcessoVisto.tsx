import { useState } from "react";
import { ArrowLeft, Plus, Filter, Send, FileText, CheckCircle, Clock, Eye, Trash2, Edit, RefreshCw } from "lucide-react";
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
import { useSaidasExpedientes } from "@/hooks/useSaidasExpedientes";

interface SaidaExpedienteProcessoVistoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const SaidaExpedienteProcessoVisto = ({ onBack, onNavigate }: SaidaExpedienteProcessoVistoProps) => {
  const { saidas, isLoading, updateSaida, deleteSaida } = useSaidasExpedientes();
  const [expedienteSelecionado, setExpedienteSelecionado] = useState<any>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (id: string) => {
    const expediente = saidas.find(s => s.id === id);
    if (expediente) {
      setExpedienteSelecionado(expediente);
      setDialogAberto(true);
    }
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await updateSaida.mutateAsync({ id, status: newStatus });
      toast.success(`Estado do expediente alterado para: ${newStatus}`);
    } catch (error) {
      toast.error("Erro ao alterar o estado do expediente");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSaida.mutateAsync(id);
      toast.success("Expediente de saída eliminado com sucesso!");
    } catch (error) {
      toast.error("Erro ao eliminar o expediente");
    }
  };

  const filteredSaidas = saidas.filter(saida => {
    if (searchTerm.length < 3) return true;
    const term = searchTerm.toLowerCase();
    return (
      saida.numero_expediente?.toLowerCase().includes(term) ||
      saida.assunto?.toLowerCase().includes(term) ||
      saida.destinatario?.toLowerCase().includes(term)
    );
  });

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

  const getStatusCount = (status: string) => {
    return saidas.filter(s => s.status === status).length;
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
            <h1 className="text-3xl font-bold text-foreground">Saída de Expediente Processo Visto</h1>
            <p className="text-muted-foreground">Gestão de notificações e correspondências</p>
          </div>
        </div>
        <Button onClick={() => onNavigate?.("nova-saida-expediente")} className="hover:scale-105 transition-transform">
          <Plus className="h-4 w-4 mr-2" />
          Nova Saída
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
              <div className="text-2xl font-bold text-foreground">{saidas.length}</div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-accent">{getStatusCount("Pendente Assinatura")}</div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-primary">
                {saidas.filter(s => s.data_envio && new Date(s.data_envio).toDateString() === new Date().toDateString()).length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-success">{getStatusCount("Enviado")}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                placeholder="Pesquisar por número, assunto ou destinatário..."
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
          <CardTitle>Expedientes de Saída</CardTitle>
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
                  <TableHead>Nº Saída</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Forma de Envio</TableHead>
                  <TableHead>Data Envio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSaidas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum expediente de saída encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSaidas.map((saida) => (
                    <TableRow key={saida.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <TableCell className="font-medium">{saida.numero_expediente}</TableCell>
                      <TableCell>{saida.tipo_documento}</TableCell>
                      <TableCell>{saida.destinatario}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{saida.assunto}</TableCell>
                      <TableCell>{saida.forma_envio}</TableCell>
                      <TableCell>{saida.data_envio ? new Date(saida.data_envio).toLocaleDateString('pt-PT') : '-'}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleChangeStatus(saida.id, "Pendente Assinatura")} className="cursor-pointer hover:bg-accent/50">
                                Pendente Assinatura
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(saida.id, "Enviado")} className="cursor-pointer hover:bg-accent/50">
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
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem a certeza que deseja eliminar o expediente {saida.numero_expediente}? Esta acção não pode ser desfeita.
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
                  <p className="font-medium">{expedienteSelecionado.tipo_documento}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Destinatário</Label>
                  <p className="font-medium">{expedienteSelecionado.destinatario}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Forma de Envio</Label>
                  <p className="font-medium">{expedienteSelecionado.forma_envio}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Assunto</Label>
                  <p className="font-medium">{expedienteSelecionado.assunto}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Envio</Label>
                  <p className="font-medium">{expedienteSelecionado.data_envio ? new Date(expedienteSelecionado.data_envio).toLocaleDateString('pt-PT') : "Não enviado"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nº de Registo</Label>
                  <p className="font-medium">{expedienteSelecionado.numero_registo || "-"}</p>
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
