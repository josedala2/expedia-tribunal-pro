import { useState } from "react";
import { ArrowLeft, Search, FileText, Calendar, User, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2, Plus, Scale, Briefcase } from "lucide-react";
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
import { PromocaoMPViewDialog } from "@/components/visto/ViewDialogs";
import { useToast } from "@/hooks/use-toast";

interface PromocaoMinisterioPublicoProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export const PromocaoMinisterioPublico = ({ onBack, onNavigate }: PromocaoMinisterioPublicoProps) => {
  const { toast } = useToast();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedPromocao, setSelectedPromocao] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    numeroProcesso: "",
    procurador: "",
    dataPromocao: "",
    tipoParecer: "",
    fundamentacao: "",
    recomendacoes: "",
  });

  const handleView = (id: string) => {
    const promocao = promocoes.find(p => p.id === id);
    if (promocao) {
      setSelectedPromocao(promocao);
      setShowViewDialog(true);
    }
  };

  const handleEdit = () => {
    setShowViewDialog(false);
    setActiveForm("novo");
  };

  const handleChangeStatus = (id: string, status: string) => {
    toast({
      title: "Status alterado",
      description: `Status alterado para: ${status}`,
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Promoção eliminada",
      description: "A promoção foi eliminada com sucesso.",
      variant: "destructive",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Promoção registada",
      description: "Promoção do Ministério Público registada com sucesso!",
    });
    setActiveForm(null);
    setFormData({
      numeroProcesso: "",
      procurador: "",
      dataPromocao: "",
      tipoParecer: "",
      fundamentacao: "",
      recomendacoes: "",
    });
  };

  // Dados mockados de promoções
  const promocoes = [
    {
      id: "1",
      numeroProcesso: "PVST-2024-001",
      procurador: "Dr. Carlos Mendes - MP",
      dataPromocao: "27/01/2024",
      tipoParecer: "Concordância",
      decisaoJuiz: "Deferimento Parcial",
      status: "Concluído",
      prazoRestante: null,
    },
    {
      id: "2",
      numeroProcesso: "PVST-2024-002",
      procurador: "Dra. Ana Silva - MP",
      dataPromocao: "26/01/2024",
      tipoParecer: "Em Análise",
      decisaoJuiz: "Deferimento Total",
      status: "Em Análise",
      prazoRestante: 3,
    },
    {
      id: "3",
      numeroProcesso: "PVST-2023-089",
      procurador: "Dr. Paulo Santos - MP",
      dataPromocao: "22/01/2024",
      tipoParecer: "Discordância",
      decisaoJuiz: "Indeferimento",
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

  const getParecerColor = (parecer: string) => {
    switch (parecer) {
      case "Concordância":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Discordância":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "Em Análise":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    }
  };

  const getPrazoColor = (dias: number | null) => {
    if (dias === null) return "";
    if (dias <= 2) return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    if (dias <= 5) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
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
          <h1 className="text-3xl font-extrabold text-foreground">Promoção do Ministério Público</h1>
          <p className="text-muted-foreground mt-1">
            Pareceres e promoções do Ministério Público sobre decisões proferidas
          </p>
        </div>
        <Button onClick={() => setActiveForm("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Promoção do MP
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Promoções</CardTitle>
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
            <p className="text-xs text-muted-foreground">Aguardando parecer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground">Pareceres emitidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazo Crítico</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">Menos de 2 dias</p>
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
                <SelectValue placeholder="Tipo de Parecer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="concordancia">Concordância</SelectItem>
                <SelectItem value="discordancia">Discordância</SelectItem>
                <SelectItem value="parcial">Concordância Parcial</SelectItem>
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
            Sobre a Promoção do Ministério Público
          </CardTitle>
          <CardDescription>
            O Ministério Público promove sobre as decisões do Juiz Relator, emitindo parecer fundamentado que será considerado para a decisão final do processo. O MP tem acesso a todo o processo, incluindo a Guia de Cobrança e demais documentos relevantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Tipos de parecer possíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Concordância com a decisão do Juiz Relator</li>
              <li>Discordância fundamentada da decisão</li>
              <li>Concordância parcial com ressalvas</li>
              <li>Recomendações adicionais ao processo</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Promoções do Ministério Público</CardTitle>
          <CardDescription>
            Pareceres emitidos pelo Ministério Público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Procurador</TableHead>
                <TableHead>Data Promoção</TableHead>
                <TableHead>Decisão do Juiz</TableHead>
                <TableHead>Tipo Parecer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promocoes.map((promocao) => (
                <TableRow key={promocao.id}>
                  <TableCell className="font-medium">
                    {promocao.numeroProcesso}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {promocao.procurador}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {promocao.dataPromocao}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {promocao.decisaoJuiz}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getParecerColor(promocao.tipoParecer)}>
                      {promocao.tipoParecer}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(promocao.status)}>
                      {promocao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {promocao.prazoRestante && (
                      <Badge variant="outline" className={getPrazoColor(promocao.prazoRestante)}>
                        {promocao.prazoRestante} dias
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(promocao.id)}
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
                          <DropdownMenuItem onClick={() => handleChangeStatus(promocao.id, "Em Análise")}>
                            Em Análise
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(promocao.id, "Concluído")}>
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
                              Tem a certeza que deseja eliminar esta promoção? Esta ação não pode ser revertida.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(promocao.id)}
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
            <DialogTitle>Nova Promoção do Ministério Público</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Emitir Parecer do Ministério Público
                </CardTitle>
                <CardDescription>
                  Registo da promoção e parecer do MP sobre a decisão do Juiz Relator
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
                    <Label htmlFor="procurador">Procurador Responsável *</Label>
                    <Input
                      id="procurador"
                      value={formData.procurador}
                      onChange={(e) => setFormData({ ...formData, procurador: e.target.value })}
                      placeholder="Nome do procurador do MP"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataPromocao">Data da Promoção *</Label>
                    <Input
                      id="dataPromocao"
                      type="date"
                      value={formData.dataPromocao}
                      onChange={(e) => setFormData({ ...formData, dataPromocao: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoParecer">Tipo de Parecer *</Label>
                    <Select
                      value={formData.tipoParecer}
                      onValueChange={(value) => setFormData({ ...formData, tipoParecer: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o parecer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concordancia">Concordância</SelectItem>
                        <SelectItem value="discordancia">Discordância</SelectItem>
                        <SelectItem value="parcial">Concordância Parcial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundamentacao">Fundamentação do Parecer *</Label>
                  <Textarea
                    id="fundamentacao"
                    value={formData.fundamentacao}
                    onChange={(e) => setFormData({ ...formData, fundamentacao: e.target.value })}
                    placeholder="Fundamentos legais e técnicos do parecer do Ministério Público"
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recomendacoes">Recomendações</Label>
                  <Textarea
                    id="recomendacoes"
                    value={formData.recomendacoes}
                    onChange={(e) => setFormData({ ...formData, recomendacoes: e.target.value })}
                    placeholder="Recomendações do Ministério Público (opcional)"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setActiveForm(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registar Promoção
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <PromocaoMPViewDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        data={selectedPromocao}
        onEdit={handleEdit}
        getStatusColor={getStatusColor}
        getParecerColor={getParecerColor}
      />
    </div>
  );
};
