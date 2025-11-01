import { ArrowLeft, Plus, Search, Filter, Eye, Trash2, Edit } from "lucide-react";
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

interface PrestacaoOrgaosSoberaniaProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PrestacaoOrgaosSoberania = ({ onBack, onNavigate }: PrestacaoOrgaosSoberaniaProps) => {
  const handleView = (id: string) => {
    toast.info(`A visualizar processo ${id}`);
    onNavigate?.("detalhe-prestacao");
  };

  const handleChangeStatus = (id: string, newStatus: string) => {
    toast.success(`Etapa do processo ${id} alterada para: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Processo ${id} eliminado com sucesso!`);
  };

  const processos = [
    {
      id: "POS-2024-001",
      orgao: "Assembleia Nacional",
      anoGerencia: "2023",
      etapaAtual: "Análise de Contas",
      juizRelator: "Dr. VJCP",
      prazo: "120 dias",
      diasRestantes: 78,
      status: "Em Termos",
      dataSubmissao: "10/01/2024"
    },
    {
      id: "POS-2024-002",
      orgao: "Presidência da República",
      anoGerencia: "2023",
      etapaAtual: "Validação",
      juizRelator: "Dr. VJCP",
      prazo: "120 dias",
      diasRestantes: 65,
      status: "Em Termos",
      dataSubmissao: "15/01/2024"
    },
    {
      id: "POS-2024-003",
      orgao: "Tribunal Constitucional",
      anoGerencia: "2023",
      etapaAtual: "Decisão",
      juizRelator: "Dr. VJCP",
      prazo: "120 dias",
      diasRestantes: 45,
      status: "Em Termos",
      dataSubmissao: "20/01/2024"
    },
  ];

  const getStatusColor = (diasRestantes: number) => {
    if (diasRestantes <= 20) return "bg-destructive text-white";
    if (diasRestantes <= 40) return "bg-accent text-white";
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
            <h1 className="text-3xl font-bold text-foreground">Prestação de Contas - Órgãos de Soberania</h1>
            <p className="text-muted-foreground">Processos específicos dos órgãos de soberania (prazo até 30 de setembro)</p>
          </div>
        </div>
        <Button onClick={() => onNavigate?.("novo-prestacao-soberania")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Órgãos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos 2023</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por número do processo ou órgão de soberania..."
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
          <CardTitle>Processos dos Órgãos de Soberania</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Órgão de Soberania</TableHead>
                <TableHead>Ano Gerência</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Juiz Relator</TableHead>
                <TableHead>Data Submissão</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Dias Restantes</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell className="font-medium">{processo.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {processo.orgao}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.anoGerencia}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-accent text-white">
                      {processo.etapaAtual}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.juizRelator}</TableCell>
                  <TableCell>{processo.dataSubmissao}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Análise de Contas")}>
                            Análise de Contas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Validação")}>
                            Validação
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
    </div>
  );
};
