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
import { toast } from "sonner";

interface PedidoReducaoEmolumentosProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PedidoReducaoEmolumentos = ({ onBack, onNavigate }: PedidoReducaoEmolumentosProps) => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleView = (id: string) => {
    console.log("Ver pedido:", id);
  };

  const handleChangeStatus = (id: string, status: string) => {
    console.log("Mudar status do pedido:", id, "para", status);
    toast.success("Status alterado com sucesso!");
  };

  const handleDelete = (id: string) => {
    console.log("Eliminar pedido:", id);
    toast.success("Pedido eliminado com sucesso!");
  };

  const handleFormSubmit = (data: any) => {
    console.log("Dados do formulário:", data);
    toast.success("Formulário submetido com sucesso!");
    setActiveForm(null);
  };

  // Dados mockados de pedidos
  const pedidos = [
    {
      id: "1",
      numeroProcesso: "PVST-2024-001",
      entidadeContratada: "Hospital Central",
      valorEmolumentos: "15.000,00 Db",
      valorProposto: "7.500,00 Db",
      dataSubmissao: "20/01/2024",
      etapaAtual: "Análise do Juiz Relator",
      status: "Em Análise",
    },
    {
      id: "2",
      numeroProcesso: "PVST-2024-002",
      entidadeContratada: "Município de São Tomé",
      valorEmolumentos: "25.000,00 Db",
      valorProposto: "12.500,00 Db",
      dataSubmissao: "22/01/2024",
      etapaAtual: "Promoção do MP",
      status: "Aguardando Promoção",
    },
    {
      id: "3",
      numeroProcesso: "PVST-2023-089",
      entidadeContratada: "Instituto Nacional de Saúde",
      valorEmolumentos: "10.000,00 Db",
      valorProposto: "5.000,00 Db",
      dataSubmissao: "15/01/2024",
      etapaAtual: "Cumprimento do Despacho",
      status: "Deferido",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Análise":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Aguardando Promoção":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Deferido":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Indeferido":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
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
          <h1 className="text-3xl font-extrabold text-foreground">Pedido de Redução de Emolumentos</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de pedidos de redução dos emolumentos devidos após concessão de visto
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
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
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Aguardando decisão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deferidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Pedidos aprovados</p>
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
                placeholder="Pesquisar por nº processo ou entidade..."
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
                <SelectItem value="deferido">Deferido</SelectItem>
                <SelectItem value="indeferido">Indeferido</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Etapa Atual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pedido">Pedido de Redução</SelectItem>
                <SelectItem value="conclusao">Conclusão dos Autos</SelectItem>
                <SelectItem value="analise">Análise do Juiz</SelectItem>
                <SelectItem value="promocao">Promoção do MP</SelectItem>
                <SelectItem value="decisao">Decisão Final</SelectItem>
                <SelectItem value="cumprimento">Cumprimento do Despacho</SelectItem>
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
            Fluxo de Pedido de Redução de Emolumentos
          </CardTitle>
          <CardDescription>
            Em caso de concessão de visto, após comunicação da decisão e dos emolumentos devidos, a entidade CONTRATADA pode solicitar redução dos emolumentos devidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">1. Pedido de Redução</Badge>
              <Badge variant="outline" className="bg-background">2. Conclusão dos Autos pela CG-SFP</Badge>
              <Badge variant="outline" className="bg-background">3. Análise e Decisão do Juiz Relator</Badge>
              <Badge variant="outline" className="bg-background">4. Promoção do MP</Badge>
              <Badge variant="outline" className="bg-background">5. Análise e Decisão Final do Juiz</Badge>
              <Badge variant="outline" className="bg-background">6. Cumprimento do Despacho</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => setActiveForm("pedido")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Pedido de Redução
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("conclusao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Conclusão dos Autos
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("analise")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Análise do Juiz Relator
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("promocao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Promoção do MP
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("decisao")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Decisão Final
              </Button>
              <Button variant="outline" onClick={() => setActiveForm("cumprimento")} className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Cumprimento do Despacho
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos de Redução</CardTitle>
          <CardDescription>
            Pedidos ativos de redução de emolumentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Entidade Contratada</TableHead>
                <TableHead>Valor Emolumentos</TableHead>
                <TableHead>Valor Proposto</TableHead>
                <TableHead>Data Submissão</TableHead>
                <TableHead>Etapa Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">
                    {pedido.numeroProcesso}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {pedido.entidadeContratada}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                      {pedido.valorEmolumentos}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                      {pedido.valorProposto}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {pedido.dataSubmissao}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {pedido.etapaAtual}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(pedido.status)}>
                      {pedido.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(pedido.id)}
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Em Análise")}>
                            Em Análise
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Aguardando Promoção")}>
                            Aguardando Promoção
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Deferido")}>
                            Deferido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "Indeferido")}>
                            Indeferido
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
                              Tem a certeza que deseja eliminar este pedido? Esta ação não pode ser revertida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(pedido.id)}
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

      {/* Placeholder para os diálogos dos formulários */}
      <Dialog open={activeForm !== null} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeForm === "pedido" && "Pedido de Redução de Emolumentos"}
              {activeForm === "conclusao" && "Conclusão dos Autos pela CG-SFP"}
              {activeForm === "analise" && "Análise e Decisão do Juiz Relator"}
              {activeForm === "promocao" && "Promoção do Ministério Público"}
              {activeForm === "decisao" && "Análise e Decisão Final do Juiz Relator"}
              {activeForm === "cumprimento" && "Cumprimento do Despacho"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-muted-foreground">
              Formulário para {activeForm} será implementado aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
