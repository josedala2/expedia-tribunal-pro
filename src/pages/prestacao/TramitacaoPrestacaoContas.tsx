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

interface TramitacaoPrestacaoContasProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const TramitacaoPrestacaoContas = ({ onBack, onNavigate }: TramitacaoPrestacaoContasProps) => {
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
      id: "PC-2024-001",
      entidade: "Ministério da Educação",
      anoGerencia: "2023",
      etapaAtual: "Análise de Contas",
      juizRelator: "Dr. António Ferreira",
      divisao: "3ª Divisão",
      prazo: "90 dias",
      diasRestantes: 45,
      status: "Em Termos"
    },
    {
      id: "PC-2024-002",
      entidade: "Governo Provincial de Luanda",
      anoGerencia: "2023",
      etapaAtual: "Validação Chefe Divisão",
      juizRelator: "Dra. Maria Santos",
      divisao: "4ª Divisão",
      prazo: "90 dias",
      diasRestantes: 15,
      status: "Em Termos"
    },
    {
      id: "PC-2024-003",
      entidade: "Assembleia Nacional",
      anoGerencia: "2023",
      etapaAtual: "Controle de Qualidade",
      juizRelator: "Dr. João Silva",
      divisao: "5ª Divisão",
      prazo: "120 dias",
      diasRestantes: 67,
      status: "Em Termos"
    },
  ];

  const getStatusColor = (diasRestantes: number) => {
    if (diasRestantes <= 10) return "bg-destructive text-white";
    if (diasRestantes <= 30) return "bg-accent text-white";
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
            <h1 className="text-3xl font-bold text-foreground">Tramitação de Prestação de Contas</h1>
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
            <div className="text-2xl font-bold text-foreground">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Análise de Contas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Validação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">36</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prazo Crítico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
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
                <TableHead>Ano Gerência</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Divisão</TableHead>
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
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary text-white">
                      {processo.anoGerencia}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-accent text-white">
                      {processo.etapaAtual}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.divisao}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(processo.id, "Análise de Contas")}>
                            Análise de Contas
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
    </div>
  );
};
