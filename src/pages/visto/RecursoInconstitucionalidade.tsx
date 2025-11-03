import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, AlertTriangle, Eye, Edit, Trash2, Download, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const recursoInconstSchema = z.object({
  processoOriginal: z.string().trim().min(1, "Número do processo é obrigatório").max(50, "Máximo 50 caracteres"),
  dataApresentacao: z.string().min(1, "Data de apresentação é obrigatória"),
  recorrente: z.string().min(1, "Selecione o recorrente"),
  estado: z.string().min(1, "Selecione o estado"),
  questaoInconstitucionalidade: z.string().trim().min(20, "Questão deve ter pelo menos 20 caracteres").max(2000, "Máximo 2000 caracteres"),
  fundamentacaoLegal: z.string().trim().min(20, "Fundamentação deve ter pelo menos 20 caracteres").max(2000, "Máximo 2000 caracteres"),
});

type RecursoInconstData = {
  id: string;
  numeroRecurso: string;
  processoOriginal: string;
  recorrente: string;
  dataApresentacao: string;
  estado: string;
  questaoInconstitucionalidade: string;
  fundamentacaoLegal: string;
};

export default function RecursoInconstitucionalidade() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedRecurso, setSelectedRecurso] = useState<RecursoInconstData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    processoOriginal: "",
    dataApresentacao: "",
    recorrente: "",
    estado: "",
    questaoInconstitucionalidade: "",
    fundamentacaoLegal: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [recursos, setRecursos] = useState<RecursoInconstData[]>([
    {
      id: "1",
      numeroRecurso: "REI-2024-001",
      processoOriginal: "PV-2024-045",
      recorrente: "Ministério Público",
      dataApresentacao: "2024-11-10",
      estado: "analise",
      questaoInconstitucionalidade: "Violação do artigo 123º da Constituição...",
      fundamentacaoLegal: "Fundamentação baseada nos artigos 123º e 145º da Constituição...",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    apresentacao: "Apresentação",
    analise: "Análise Presidente",
    decisao: "Decisão Presidente",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      recursoInconstSchema.parse(formData);
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
            ? { ...r, ...formData }
            : r
        )
      );
      toast({
        title: "Recurso atualizado",
        description: "O recurso extraordinário foi atualizado com sucesso.",
      });
      setEditingRecurso(null);
    } else {
      const novoRecurso: RecursoInconstData = {
        id: Date.now().toString(),
        numeroRecurso: `REI-2024-${String(recursos.length + 1).padStart(3, "0")}`,
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
      dataApresentacao: "",
      recorrente: "",
      estado: "",
      questaoInconstitucionalidade: "",
      fundamentacaoLegal: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingRecurso(null);
  };

  const handleEdit = (recurso: RecursoInconstData) => {
    setFormData({
      processoOriginal: recurso.processoOriginal,
      dataApresentacao: recurso.dataApresentacao,
      recorrente: recurso.recorrente,
      estado: recurso.estado,
      questaoInconstitucionalidade: recurso.questaoInconstitucionalidade,
      fundamentacaoLegal: recurso.fundamentacaoLegal,
    });
    setEditingRecurso(recurso.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este recurso extraordinário?")) {
      setRecursos(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Recurso eliminado",
        description: "O recurso extraordinário foi eliminado com sucesso.",
      });
    }
  };

  const handleViewDetails = (recurso: RecursoInconstData) => {
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
      case "apresentacao":
        return "outline";
      case "analise":
        return "secondary";
      case "decisao":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recurso Extraordinário de Inconstitucionalidade</h1>
        <p className="text-muted-foreground">
          Gestão de recursos extraordinários de inconstitucionalidade
        </p>
      </div>

      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader className="bg-orange-50 dark:bg-orange-950/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900 dark:text-orange-100">
              Recurso de Caráter Extraordinário
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Este tipo de recurso tem natureza extraordinária e requer análise e decisão do Presidente do Tribunal de Contas.
            A apresentação deve fundamentar questões de inconstitucionalidade.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Recursos de Inconstitucionalidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Total de Recursos</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-muted-foreground">Em Análise</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-muted-foreground">Aguardando Decisão</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registos de Recursos de Inconstitucionalidade</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recurso
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingRecurso ? "Editar Recurso Extraordinário" : "Registar Novo Recurso Extraordinário"}
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
                  <Label>Data de Apresentação *</Label>
                  <Input
                    type="date"
                    value={formData.dataApresentacao}
                    onChange={(e) => handleInputChange("dataApresentacao", e.target.value)}
                    className={formErrors.dataApresentacao ? "border-red-500" : ""}
                  />
                  {formErrors.dataApresentacao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataApresentacao}</p>
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
                      <SelectItem value="Entidade Contratada">Entidade Contratada</SelectItem>
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
                      <SelectItem value="apresentacao">Apresentação</SelectItem>
                      <SelectItem value="analise">Análise Presidente</SelectItem>
                      <SelectItem value="decisao">Decisão Presidente</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.estado && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.estado}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Questão de Inconstitucionalidade *</Label>
                  <Textarea
                    placeholder="Descreva a questão de inconstitucionalidade invocada (mínimo 20 caracteres)"
                    rows={4}
                    value={formData.questaoInconstitucionalidade}
                    onChange={(e) => handleInputChange("questaoInconstitucionalidade", e.target.value)}
                    className={formErrors.questaoInconstitucionalidade ? "border-red-500" : ""}
                  />
                  {formErrors.questaoInconstitucionalidade && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.questaoInconstitucionalidade}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.questaoInconstitucionalidade.length}/2000 caracteres
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamentação Legal *</Label>
                  <Textarea
                    placeholder="Indique os fundamentos legais e constitucionais (mínimo 20 caracteres)"
                    rows={4}
                    value={formData.fundamentacaoLegal}
                    onChange={(e) => handleInputChange("fundamentacaoLegal", e.target.value)}
                    className={formErrors.fundamentacaoLegal ? "border-red-500" : ""}
                  />
                  {formErrors.fundamentacaoLegal && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fundamentacaoLegal}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fundamentacaoLegal.length}/2000 caracteres
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
                <SelectItem value="apresentacao">Apresentação</SelectItem>
                <SelectItem value="analise">Em Análise</SelectItem>
                <SelectItem value="decisao">Aguardando Decisão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRecursos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum recurso extraordinário encontrado</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Processo Original</TableHead>
                    <TableHead>Recorrente</TableHead>
                    <TableHead>Data Apresentação</TableHead>
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
                          {new Date(recurso.dataApresentacao).toLocaleDateString("pt-PT")}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Detalhes do Recurso Extraordinário de Inconstitucionalidade
            </DialogTitle>
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
                  <Label className="text-xs text-muted-foreground">Data de Apresentação</Label>
                  <p className="font-medium">
                    {new Date(selectedRecurso.dataApresentacao).toLocaleDateString("pt-PT")}
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
                <Label className="text-xs text-muted-foreground">Questão de Inconstitucionalidade</Label>
                <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-md border border-orange-200 dark:border-orange-900">
                  <p className="text-sm whitespace-pre-wrap">{selectedRecurso.questaoInconstitucionalidade}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Fundamentação Legal</Label>
                <div className="mt-2 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedRecurso.fundamentacaoLegal}</p>
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
