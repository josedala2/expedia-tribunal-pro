import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, Trash2, Edit } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TramitacaoProcessoVistoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const TramitacaoProcessoVisto = ({ onBack, onNavigate }: TramitacaoProcessoVistoProps) => {
  const [processoSelecionado, setProcessoSelecionado] = useState<any>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleView = (id: string) => {
    const processo = processos.find(p => p.id === id);
    if (processo) {
      setProcessoSelecionado(processo);
      setDialogAberto(true);
    }
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    toast.success(`Etapa do processo ${id} alterada para: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Processo ${id} eliminado com sucesso!`);
  };

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
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleView(processo.id)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" title="Alterar etapa">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card">
                          <DropdownMenuLabel>Alterar Etapa</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Análise Técnica")}>
                            Análise Técnica
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Validação Chefe Divisão")}>
                            Validação Chefe Divisão
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Controle de Qualidade")}>
                            Controle de Qualidade
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Decisão")}>
                            Decisão
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
                              Tem certeza que deseja eliminar o processo {processo.id}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(processo.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

      {processoSelecionado && (
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Processo {processoSelecionado.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número do Processo</Label>
                  <p className="font-medium">{processoSelecionado.id}</p>
                </div>
                <div>
                  <Label>Entidade</Label>
                  <p className="font-medium">{processoSelecionado.entidade}</p>
                </div>
                <div>
                  <Label>Valor do Contrato</Label>
                  <p className="font-medium">{processoSelecionado.valorContrato}</p>
                </div>
                <div>
                  <Label>Juiz Relator</Label>
                  <p className="font-medium">{processoSelecionado.juizRelator}</p>
                </div>
                <div>
                  <Label>Etapa Atual</Label>
                  <p className="font-medium">{processoSelecionado.etapaAtual}</p>
                </div>
                <div>
                  <Label>Prazo</Label>
                  <p className="font-medium">{processoSelecionado.prazo}</p>
                </div>
                <div>
                  <Label>Dias Restantes</Label>
                  <p className="font-medium">{processoSelecionado.diasRestantes} dias</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(processoSelecionado.diasRestantes)}>
                    {processoSelecionado.status}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
