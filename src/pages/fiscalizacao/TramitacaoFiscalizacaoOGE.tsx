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
  const handleView = (id: string) => {
    toast.info(`A visualizar processo ${id}`);
    onNavigate?.("detalhe-fiscalizacao");
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    toast.success(`Etapa do processo ${id} alterada para: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Processo ${id} eliminado com sucesso!`);
  };

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
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Em Apreciação")}>
                            Em Apreciação
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Parecer Competente")}>
                            Parecer Competente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Controle de Qualidade")}>
                            Controle de Qualidade
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Resolução")}>
                            Resolução
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
    </div>
  );
};
