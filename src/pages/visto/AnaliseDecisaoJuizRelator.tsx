import { useState } from "react";
import { ArrowLeft, Search, FileText, Calendar, User, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2, Plus, Scale, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface AnaliseDecisaoJuizRelatorProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const AnaliseDecisaoJuizRelator = ({ onBack, onNavigate }: AnaliseDecisaoJuizRelatorProps) => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    numeroProcesso: "",
    juizRelator: "",
    dataAnalise: "",
    tipoDecisao: "",
    fundamentacao: "",
    observacoes: "",
  });

  const handleView = (id: string) => {
    console.log("Ver análise:", id);
  };

  const handleChangeStatus = (id: string, status: string) => {
    console.log("Mudar status da análise:", id, "para", status);
    toast.success("Status alterado com sucesso!");
  };

  const handleDelete = (id: string) => {
    console.log("Eliminar análise:", id);
    toast.success("Análise eliminada com sucesso!");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    toast.success("Decisão do Juiz Relator registada com sucesso!");
    setActiveForm(null);
    setFormData({
      numeroProcesso: "",
      juizRelator: "",
      dataAnalise: "",
      tipoDecisao: "",
      fundamentacao: "",
      observacoes: "",
    });
  };

  // Dados mockados de análises e decisões
  const analises = [
    {
      id: "1",
      numeroProcesso: "PVST-2024-001",
      juizRelator: "Dr. António Costa",
      dataAnalise: "25/01/2024",
      tipoDecisao: "Deferimento Parcial",
      valorOriginal: "15.000,00 Db",
      valorDeferido: "10.000,00 Db",
      status: "Concluído",
      prazoRestante: null,
    },
    {
      id: "2",
      numeroProcesso: "PVST-2024-002",
      juizRelator: "Dra. Isabel Ferreira",
      dataAnalise: "23/01/2024",
      tipoDecisao: "Em Análise",
      valorOriginal: "25.000,00 Db",
      valorDeferido: "-",
      status: "Em Análise",
      prazoRestante: 5,
    },
    {
      id: "3",
      numeroProcesso: "PVST-2023-089",
      juizRelator: "Dr. Manuel Sousa",
      dataAnalise: "20/01/2024",
      tipoDecisao: "Indeferimento",
      valorOriginal: "10.000,00 Db",
      valorDeferido: "-",
      status: "Concluído",
      prazoRestante: null,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Análise":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Concluído":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Pendente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getPrazoColor = (dias: number | null) => {
    if (dias === null) return "";
    if (dias <= 3) return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    if (dias <= 7) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
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
          <h1 className="text-3xl font-extrabold text-foreground">Análise e Decisão do Juiz Relator</h1>
          <p className="text-muted-foreground mt-1">
            Análise e decisão do Juiz Relator sobre pedidos e processos
          </p>
        </div>
        <Button onClick={() => setActiveForm("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise e Decisão
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">No sistema</p>
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
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground">Decisões proferidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazo Crítico</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">Menos de 3 dias</p>
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
                placeholder="Pesquisar por nº processo..."
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
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Juiz Relator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="antonio">Dr. António Costa</SelectItem>
                <SelectItem value="isabel">Dra. Isabel Ferreira</SelectItem>
                <SelectItem value="manuel">Dr. Manuel Sousa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informação */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Sobre a Análise e Decisão do Juiz Relator
          </CardTitle>
          <CardDescription>
            O Juiz Relator analisa os autos e profere decisão sobre os pedidos submetidos, podendo deferir, deferir parcialmente ou indeferir, fundamentando sua decisão de acordo com a legislação vigente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Tipos de decisão possíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Deferimento total do pedido</li>
              <li>Deferimento parcial do pedido</li>
              <li>Indeferimento do pedido</li>
              <li>Solicitação de elementos adicionais</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Análises e Decisões</CardTitle>
          <CardDescription>
            Decisões proferidas pelos Juízes Relatores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Juiz Relator</TableHead>
                <TableHead>Data Análise</TableHead>
                <TableHead>Tipo Decisão</TableHead>
                <TableHead>Valor Original</TableHead>
                <TableHead>Valor Deferido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analises.map((analise) => (
                <TableRow key={analise.id}>
                  <TableCell className="font-medium">
                    {analise.numeroProcesso}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-muted-foreground" />
                      {analise.juizRelator}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {analise.dataAnalise}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {analise.tipoDecisao}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {analise.valorOriginal}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {analise.valorDeferido}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(analise.status)}>
                      {analise.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {analise.prazoRestante && (
                      <Badge variant="outline" className={getPrazoColor(analise.prazoRestante)}>
                        {analise.prazoRestante} dias
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(analise.id)}
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(analise.id, "Em Análise")}>
                            Em Análise
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(analise.id, "Concluído")}>
                            Concluído
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
                              Tem a certeza que deseja eliminar esta análise? Esta ação não pode ser revertida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(analise.id)}
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

      {/* Diálogo do Formulário */}
      <Dialog open={activeForm === "novo"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Análise e Decisão do Juiz Relator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Proferir Decisão
                </CardTitle>
                <CardDescription>
                  Registo da análise e decisão do Juiz Relator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroProcesso">Nº do Processo *</Label>
                    <Input
                      id="numeroProcesso"
                      value={formData.numeroProcesso}
                      onChange={(e) => setFormData({ ...formData, numeroProcesso: e.target.value })}
                      placeholder="Ex: PVST-2024-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="juizRelator">Juiz Relator *</Label>
                    <Select
                      value={formData.juizRelator}
                      onValueChange={(value) => setFormData({ ...formData, juizRelator: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Juiz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antonio">Dr. António Costa</SelectItem>
                        <SelectItem value="isabel">Dra. Isabel Ferreira</SelectItem>
                        <SelectItem value="manuel">Dr. Manuel Sousa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataAnalise">Data da Análise *</Label>
                    <Input
                      id="dataAnalise"
                      type="date"
                      value={formData.dataAnalise}
                      onChange={(e) => setFormData({ ...formData, dataAnalise: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoDecisao">Tipo de Decisão *</Label>
                    <Select
                      value={formData.tipoDecisao}
                      onValueChange={(value) => setFormData({ ...formData, tipoDecisao: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a decisão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deferimento">Deferimento Total</SelectItem>
                        <SelectItem value="parcial">Deferimento Parcial</SelectItem>
                        <SelectItem value="indeferimento">Indeferimento</SelectItem>
                        <SelectItem value="elementos">Solicitação de Elementos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundamentacao">Fundamentação Legal da Decisão *</Label>
                  <Textarea
                    id="fundamentacao"
                    value={formData.fundamentacao}
                    onChange={(e) => setFormData({ ...formData, fundamentacao: e.target.value })}
                    placeholder="Descreva os fundamentos legais e técnicos da decisão proferida"
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações adicionais"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setActiveForm(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registar Decisão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
