import { useState } from "react";
import { ArrowLeft, Search, Filter, FileText, Calendar, User, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NotificacaoPartesForm } from "./forms/NotificacaoPartesForm";
import { RececaoRequerimentoForm } from "./forms/RececaoRequerimentoForm";
import { DecisaoRecursoForm } from "./forms/DecisaoRecursoForm";
import { PromocaoMPForm } from "./forms/PromocaoMPForm";
import { ConclusaoAutosForm } from "./forms/ConclusaoAutosForm";
import { DespachoFinalForm } from "./forms/DespachoFinalForm";
import { toast } from "sonner";

interface InterposicaoRecursoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const InterposicaoRecurso = ({ onBack, onNavigate }: InterposicaoRecursoProps) => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleView = (id: string) => {
    console.log("Ver recurso:", id);
  };

  const handleChangeStatus = (id: string, status: string) => {
    console.log("Mudar status do recurso:", id, "para", status);
    toast.success("Status alterado com sucesso!");
  };

  const handleDelete = (id: string) => {
    console.log("Eliminar recurso:", id);
    toast.success("Recurso eliminado com sucesso!");
  };

  const handleFormSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    toast.success("Formulário submetido com sucesso!");
    setActiveForm(null);
  };

  // Dados mockados de recursos
  const recursos = [
    {
      id: "1",
      numeroProcesso: "PVST-2024-001",
      recorrente: "Ministério Público",
      dataInterposicao: "15/01/2024",
      prazoRestante: 15,
      etapaAtual: "Receção de Requerimento",
      status: "Em Análise",
      decisaoOriginal: "Recusa de Visto",
    },
    {
      id: "2",
      numeroProcesso: "PVST-2024-002",
      recorrente: "Hospital Central",
      dataInterposicao: "20/01/2024",
      prazoRestante: 10,
      etapaAtual: "Notificação ao MP",
      status: "Aguardando Promoção",
      decisaoOriginal: "Recusa de Visto",
    },
    {
      id: "3",
      numeroProcesso: "PVST-2023-089",
      recorrente: "Município de São Tomé",
      dataInterposicao: "10/01/2024",
      prazoRestante: 25,
      etapaAtual: "Conclusão dos Autos",
      status: "Em Análise",
      decisaoOriginal: "Recusa de Visto",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Análise":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Aguardando Promoção":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Concluído":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Rejeitado":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getPrazoColor = (dias: number) => {
    if (dias <= 5) return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    if (dias <= 10) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-foreground">Interposição de Recurso</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de recursos interpostos sobre decisões de processos de visto
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recursos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground">Aguardando decisão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Promoção</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Pendente do MP</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazo Crítico</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">Menos de 5 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar e Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nº processo ou recorrente..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="analise">Em Análise</SelectItem>
                <SelectItem value="promocao">Aguardando Promoção</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Etapa Atual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="rececao">Receção de Requerimento</SelectItem>
                <SelectItem value="notificacao">Notificação ao MP</SelectItem>
                <SelectItem value="decisao">Decisão</SelectItem>
                <SelectItem value="promocao">Despacho de Promoção</SelectItem>
                <SelectItem value="conclusao">Conclusão dos Autos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informação sobre o Fluxo */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Fluxo de Interposição de Recurso
          </CardTitle>
          <CardDescription>
            Após a decisão do Juiz Relator e notificação às partes, no prazo de 20 dias o recurso pode ser interposto pelo Ministério Público ou pela Entidade Contratante (normalmente em caso de Recusa de Visto).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">1. Notificação às Partes</Badge>
              <Badge variant="outline" className="bg-background">2. Receção de Requerimento</Badge>
              <Badge variant="outline" className="bg-background">3. Decisão</Badge>
              <Badge variant="outline" className="bg-background">4. Notificação ao MP</Badge>
              <Badge variant="outline" className="bg-background">5. Despacho de Promoção</Badge>
              <Badge variant="outline" className="bg-background">6. Conclusão dos Autos</Badge>
              <Badge variant="outline" className="bg-background">7. Despacho Final</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => setActiveForm("notificacao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Notificação às Partes
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("rececao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Receção de Requerimento
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("decisao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Decisão sobre Recurso
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("promocao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Promoção do MP
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("conclusao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Conclusão dos Autos
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("despacho")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Despacho Final
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Recursos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Recursos Interpostos</CardTitle>
          <CardDescription>
            Recursos ativos sobre decisões de processos de visto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Recorrente</TableHead>
                <TableHead>Data Interposição</TableHead>
                <TableHead>Decisão Original</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recursos.map((recurso) => (
                <TableRow key={recurso.id}>
                  <TableCell className="font-medium">
                    {recurso.numeroProcesso}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {recurso.recorrente}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {recurso.dataInterposicao}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                      {recurso.decisaoOriginal}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {recurso.etapaAtual}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(recurso.status)}>
                      {recurso.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPrazoColor(recurso.prazoRestante)}>
                      {recurso.prazoRestante} dias
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(recurso.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleChangeStatus(recurso.id, "Em Análise")}>
                            Em Análise
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(recurso.id, "Aguardando Promoção")}>
                            Aguardando Promoção
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(recurso.id, "Concluído")}>
                            Concluído
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(recurso.id, "Rejeitado")}>
                            Rejeitado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem a certeza que deseja eliminar este recurso? Esta ação não pode ser revertida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(recurso.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
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

      {/* Diálogos para os Formulários */}
      <Dialog open={activeForm === "notificacao"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notificação às Partes</DialogTitle>
          </DialogHeader>
          <NotificacaoPartesForm onSubmit={handleFormSubmit} onCancel={() => setActiveForm(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === "rececao"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receção de Requerimento</DialogTitle>
          </DialogHeader>
          <RececaoRequerimentoForm onSubmit={handleFormSubmit} onCancel={() => setActiveForm(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === "decisao"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Decisão sobre Recurso</DialogTitle>
          </DialogHeader>
          <DecisaoRecursoForm onSubmit={handleFormSubmit} onCancel={() => setActiveForm(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === "promocao"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Promoção do MP</DialogTitle>
          </DialogHeader>
          <PromocaoMPForm onSubmit={handleFormSubmit} onCancel={() => setActiveForm(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === "conclusao"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Conclusão dos Autos</DialogTitle>
          </DialogHeader>
          <ConclusaoAutosForm onSubmit={handleFormSubmit} onCancel={() => setActiveForm(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === "despacho"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Despacho Final</DialogTitle>
          </DialogHeader>
          <DespachoFinalForm onSubmit={handleFormSubmit} onCancel={() => setActiveForm(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
