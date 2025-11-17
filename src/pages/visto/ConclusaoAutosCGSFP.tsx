import { useState } from "react";
import { ArrowLeft, Search, FileText, Calendar, User, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2, Plus, FileCheck } from "lucide-react";
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
import { ConclusaoAutosViewDialog } from "@/components/visto/ViewDialogs";
import { useToast } from "@/hooks/use-toast";
import { useConclusaoAutos } from "@/hooks/useConclusaoAutos";
import { Skeleton } from "@/components/ui/skeleton";

interface ConclusaoAutosCGSFPProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const ConclusaoAutosCGSFP = ({ onBack, onNavigate }: ConclusaoAutosCGSFPProps) => {
  const { toast } = useToast();
  const { conclusoes, isLoading, createConclusao, updateConclusao, deleteConclusao } = useConclusaoAutos();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedTermo, setSelectedTermo] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    numeroProcesso: "",
    numeroTermo: "",
    escrivao: "",
    dataConclusao: "",
    destinatario: "",
    motivo: "",
    observacoes: "",
  });

  const handleView = (id: string) => {
    const termo = conclusoes.find(t => t.id === id);
    if (termo) {
      setSelectedTermo(termo);
      setShowViewDialog(true);
    }
  };

  const handleEdit = () => {
    setShowViewDialog(false);
    setActiveForm("novo");
  };

  const handleChangeStatus = (id: string, status: string) => {
    updateConclusao.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    deleteConclusao.mutate(id);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConclusao.mutateAsync({
        numero_termo: formData.numeroTermo || `TC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`,
        escrivao: formData.escrivao,
        destinatario: formData.destinatario,
        data_conclusao: formData.dataConclusao,
        motivo: formData.motivo,
        observacoes: formData.observacoes,
        status: "Pendente",
      });
      setActiveForm(null);
      setFormData({
        numeroProcesso: "",
        numeroTermo: "",
        escrivao: "",
        dataConclusao: "",
        destinatario: "",
        motivo: "",
        observacoes: "",
      });
    } catch (error) {
      console.error("Erro ao criar termo:", error);
    }
  };

  const termos = conclusoes.length > 0 ? conclusoes.map(c => ({
    id: c.id,
    numeroProcesso: c.processo_id || "-",
    numeroTermo: c.numero_termo,
    escrivao: c.escrivao,
    destinatario: c.destinatario,
    dataConclusao: new Date(c.data_conclusao).toLocaleDateString('pt-PT'),
    tipoDocumento: "Termo de Conclusão",
    status: c.status || "Pendente",
    motivo: c.motivo || "-",
  })) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Concluído":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Arquivado":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
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
          <h1 className="text-3xl font-extrabold text-foreground">Conclusão dos Autos pela CG-SFP</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de termos de conclusão dos autos para remessa ao Juiz Relator
          </p>
        </div>
        <Button onClick={() => setActiveForm("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Termo de Conclusão
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Termos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{isLoading ? <Skeleton className="h-8 w-12" /> : termos.length}</div>
            <p className="text-xs text-muted-foreground">Elaborados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? <Skeleton className="h-8 w-12" /> : termos.filter(t => t.status === "Pendente").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando apreciação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? <Skeleton className="h-8 w-12" /> : termos.filter(t => t.status === "Concluído").length}
            </div>
            <p className="text-xs text-muted-foreground">Termos finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <FileCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Processos arquivados</p>
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
                placeholder="Pesquisar por nº processo ou termo..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Escrivão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="joao">João Silva</SelectItem>
                <SelectItem value="maria">Maria Santos</SelectItem>
                <SelectItem value="pedro">Pedro Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informação sobre o Termo de Conclusão */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Sobre o Termo de Conclusão dos Autos
          </CardTitle>
          <CardDescription>
            O Termo de Conclusão é elaborado pelo Escrivão dos autos da CG-SFP para remeter os autos ao Juiz Relator, permitindo que profira o despacho sobre a junção de documentos aos autos, como comprovativo de pagamento, elementos solicitados, ou outras peças processuais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Principais finalidades:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Remessa de autos ao Juiz Relator para despacho</li>
              <li>Junção de comprovativo de pagamento aos autos</li>
              <li>Submissão de elementos solicitados</li>
              <li>Encaminhamento de documentação complementar</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Termos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Termos de Conclusão</CardTitle>
          <CardDescription>
            Termos elaborados pela CG-SFP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Nº Termo</TableHead>
                <TableHead>Escrivão</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : termos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum termo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                termos.map((termo) => (
                <TableRow key={termo.id}>
                  <TableCell className="font-medium">
                    {termo.numeroProcesso}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {termo.numeroTermo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {termo.escrivao}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {termo.destinatario}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {termo.dataConclusao}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {termo.motivo}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(termo.status)}>
                      {termo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(termo.id)}
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(termo.id, "Pendente")}>
                            Pendente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(termo.id, "Concluído")}>
                            Concluído
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(termo.id, "Arquivado")}>
                            Arquivado
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
                              Tem a certeza que deseja eliminar este termo? Esta ação não pode ser revertida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(termo.id)}
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
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo do Formulário */}
      <Dialog open={activeForm === "novo"} onOpenChange={(open) => !open && setActiveForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Termo de Conclusão dos Autos</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Elaboração do Termo de Conclusão
                </CardTitle>
                <CardDescription>
                  Preencha os dados para elaborar o termo de conclusão dos autos
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
                    <Label htmlFor="escrivao">Escrivão dos Autos *</Label>
                    <Select
                      value={formData.escrivao}
                      onValueChange={(value) => setFormData({ ...formData, escrivao: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o escrivão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joao">João Silva</SelectItem>
                        <SelectItem value="maria">Maria Santos</SelectItem>
                        <SelectItem value="pedro">Pedro Oliveira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataConclusao">Data da Conclusão *</Label>
                    <Input
                      id="dataConclusao"
                      type="date"
                      value={formData.dataConclusao}
                      onChange={(e) => setFormData({ ...formData, dataConclusao: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinatario">Destinatário (Juiz Relator) *</Label>
                    <Select
                      value={formData.destinatario}
                      onValueChange={(value) => setFormData({ ...formData, destinatario: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Juiz Relator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antonio">Dr. António Costa</SelectItem>
                        <SelectItem value="isabel">Dra. Isabel Ferreira</SelectItem>
                        <SelectItem value="manuel">Dr. Manuel Sousa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Motivo e Observações *</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Descreva o motivo da remessa dos autos ao Juiz Relator (ex: para despacho sobre junção de comprovativo de pagamento aos autos)"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setActiveForm(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Elaborar Termo de Conclusão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <ConclusaoAutosViewDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        data={selectedTermo}
        onEdit={handleEdit}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};
