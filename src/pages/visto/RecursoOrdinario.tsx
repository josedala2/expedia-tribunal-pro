import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye, Edit, Trash2, Download, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const recursoSchema = z.object({
  processoOriginal: z.string().trim().min(1, "Número do processo é obrigatório").max(50, "Máximo 50 caracteres"),
  dataInterposicao: z.string().min(1, "Data de interposição é obrigatória"),
  recorrente: z.string().min(1, "Selecione o recorrente"),
  estado: z.string().min(1, "Selecione o estado"),
  fundamento: z.string().trim().min(10, "Fundamento deve ter pelo menos 10 caracteres").max(2000, "Máximo 2000 caracteres"),
});

type RecursoData = {
  id: string;
  numeroRecurso: string;
  processoOriginal: string;
  recorrente: string;
  dataInterposicao: string;
  estado: string;
  fundamento: string;
};

export default function RecursoOrdinario() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedRecurso, setSelectedRecurso] = useState<RecursoData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    processoOriginal: "",
    dataInterposicao: "",
    recorrente: "",
    estado: "",
    fundamento: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [recursos, setRecursos] = useState<RecursoData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      processoOriginal: "PV-2024-123",
      recorrente: "Ministério Público",
      dataInterposicao: "2024-10-15",
      estado: "plenario",
      fundamento: "Recurso interposto contra a decisão de recusa de visto...",
    },
    {
      id: "2",
      numeroRecurso: "RO-2024-002",
      processoOriginal: "PV-2024-098",
      recorrente: "Entidade Pública",
      dataInterposicao: "2024-10-20",
      estado: "projeto",
      fundamento: "Recurso contra a decisão de homologação...",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    registo: "Registo e Autuação",
    plenario: "Plenário da Câmara",
    projeto: "Projeto de Acórdão",
    vista: "Vista aos Membros",
    resolucao: "Resolução Plenária",
    notificacao: "Notificação",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      recursoSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    if (editingRecurso) {
      setRecursos(prev =>
        prev.map(r =>
          r.id === editingRecurso
            ? { ...r, ...formData, processoOriginal: formData.processoOriginal }
            : r
        )
      );
      toast({
        title: "Recurso atualizado",
        description: "O recurso foi atualizado com sucesso.",
      });
      setEditingRecurso(null);
    } else {
      const novoRecurso: RecursoData = {
        id: Date.now().toString(),
        numeroRecurso: `RO-2024-${String(recursos.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setRecursos(prev => [...prev, novoRecurso]);
      toast({
        title: "Recurso registado",
        description: `Recurso ${novoRecurso.numeroRecurso} foi registado com sucesso.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      processoOriginal: "",
      dataInterposicao: "",
      recorrente: "",
      estado: "",
      fundamento: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingRecurso(null);
  };

  const handleEdit = (recurso: RecursoData) => {
    setFormData({
      processoOriginal: recurso.processoOriginal,
      dataInterposicao: recurso.dataInterposicao,
      recorrente: recurso.recorrente,
      estado: recurso.estado,
      fundamento: recurso.fundamento,
    });
    setEditingRecurso(recurso.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este recurso?")) {
      setRecursos(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Recurso eliminado",
        description: "O recurso foi eliminado com sucesso.",
      });
    }
  };

  const handleViewDetails = (recurso: RecursoData) => {
    setSelectedRecurso(recurso);
    setShowDetailDialog(true);
  };

  const filteredRecursos = recursos.filter(recurso => {
    const matchesSearch =
      recurso.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.processoOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.recorrente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || recurso.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "registo":
        return "outline";
      case "plenario":
        return "secondary";
      case "projeto":
        return "default";
      case "vista":
        return "secondary";
      case "resolucao":
        return "default";
      case "notificacao":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recurso Ordinário</h1>
        <p className="text-muted-foreground">
          Gestão de processos de recurso ordinário
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Recursos Ordinários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Total de Recursos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">Em Análise</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">4</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registos de Recursos Ordinários</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recurso
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingRecurso ? "Editar Recurso Ordinário" : "Registar Novo Recurso Ordinário"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Número do Processo Original *</Label>
                  <Input
                    placeholder="Ex: PV-2024-001"
                    value={formData.processoOriginal}
                    onChange={(e) => handleInputChange("processoOriginal", e.target.value)}
                    className={formErrors.processoOriginal ? "border-red-500" : ""}
                  />
                  {formErrors.processoOriginal && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.processoOriginal}</p>
                  )}
                </div>
                <div>
                  <Label>Data de Interposição *</Label>
                  <Input
                    type="date"
                    value={formData.dataInterposicao}
                    onChange={(e) => handleInputChange("dataInterposicao", e.target.value)}
                    className={formErrors.dataInterposicao ? "border-red-500" : ""}
                  />
                  {formErrors.dataInterposicao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataInterposicao}</p>
                  )}
                </div>
                <div>
                  <Label>Recorrente *</Label>
                  <Select
                    value={formData.recorrente}
                    onValueChange={(value) => handleInputChange("recorrente", value)}
                  >
                    <SelectTrigger className={formErrors.recorrente ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ministério Público">Ministério Público</SelectItem>
                      <SelectItem value="Entidade Pública">Entidade Pública</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.recorrente && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.recorrente}</p>
                  )}
                </div>
                <div>
                  <Label>Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => handleInputChange("estado", value)}
                  >
                    <SelectTrigger className={formErrors.estado ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registo">Registo e Autuação</SelectItem>
                      <SelectItem value="plenario">Plenário da Câmara</SelectItem>
                      <SelectItem value="projeto">Projeto de Acórdão</SelectItem>
                      <SelectItem value="vista">Vista aos Membros</SelectItem>
                      <SelectItem value="resolucao">Resolução Plenária</SelectItem>
                      <SelectItem value="notificacao">Notificação</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.estado && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.estado}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamento do Recurso *</Label>
                  <Textarea
                    placeholder="Descreva os fundamentos (mínimo 10 caracteres)"
                    rows={4}
                    value={formData.fundamento}
                    onChange={(e) => handleInputChange("fundamento", e.target.value)}
                    className={formErrors.fundamento ? "border-red-500" : ""}
                  />
                  {formErrors.fundamento && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fundamento}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fundamento.length}/2000 caracteres
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSubmit}>
                  {editingRecurso ? "Atualizar Recurso" : "Registar Recurso"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por número de recurso, processo ou recorrente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Estados</SelectItem>
                <SelectItem value="registo">Registo e Autuação</SelectItem>
                <SelectItem value="plenario">Plenário da Câmara</SelectItem>
                <SelectItem value="projeto">Projeto de Acórdão</SelectItem>
                <SelectItem value="vista">Vista aos Membros</SelectItem>
                <SelectItem value="resolucao">Resolução Plenária</SelectItem>
                <SelectItem value="notificacao">Notificação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRecursos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum recurso encontrado</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Processo Original</TableHead>
                    <TableHead>Recorrente</TableHead>
                    <TableHead>Data Interposição</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecursos.map((recurso) => (
                    <TableRow key={recurso.id}>
                      <TableCell className="font-medium">{recurso.numeroRecurso}</TableCell>
                      <TableCell>{recurso.processoOriginal}</TableCell>
                      <TableCell>{recurso.recorrente}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(recurso.dataInterposicao).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(recurso.estado)}>
                          {estadoLabels[recurso.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(recurso)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(recurso)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(recurso.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Exportar"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Recurso Ordinário</DialogTitle>
            <DialogDescription>
              {selectedRecurso?.numeroRecurso}
            </DialogDescription>
          </DialogHeader>
          {selectedRecurso && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Nº Recurso</Label>
                  <p className="font-medium">{selectedRecurso.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Processo Original</Label>
                  <p className="font-medium">{selectedRecurso.processoOriginal}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Recorrente</Label>
                  <p className="font-medium">{selectedRecurso.recorrente}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data de Interposição</Label>
                  <p className="font-medium">
                    {new Date(selectedRecurso.dataInterposicao).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Estado Atual</Label>
                  <div className="mt-1">
                    <Badge variant={getEstadoBadgeVariant(selectedRecurso.estado)}>
                      {estadoLabels[selectedRecurso.estado]}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Fundamento do Recurso</Label>
                <div className="mt-2 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedRecurso.fundamento}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleEdit(selectedRecurso)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
