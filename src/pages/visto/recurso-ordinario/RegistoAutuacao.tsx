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

const registoSchema = z.object({
  numeroRecurso: z.string().trim().min(1, "Número do recurso é obrigatório").max(50, "Máximo 50 caracteres"),
  processoOriginal: z.string().trim().min(1, "Número do processo original é obrigatório").max(50, "Máximo 50 caracteres"),
  dataRecebimento: z.string().min(1, "Data de recebimento é obrigatória"),
  recorrente: z.string().min(1, "Selecione o recorrente"),
  tipoRecurso: z.string().min(1, "Selecione o tipo de recurso"),
  observacoes: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

type RegistoData = {
  id: string;
  numeroRecurso: string;
  processoOriginal: string;
  recorrente: string;
  dataRecebimento: string;
  tipoRecurso: string;
  estado: string;
  observacoes?: string;
};

export default function RegistoAutuacao() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedRegisto, setSelectedRegisto] = useState<RegistoData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingRegisto, setEditingRegisto] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numeroRecurso: "",
    processoOriginal: "",
    dataRecebimento: "",
    recorrente: "",
    tipoRecurso: "",
    observacoes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [registos, setRegistos] = useState<RegistoData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      processoOriginal: "PV-2024-123",
      recorrente: "Ministério Público",
      dataRecebimento: "2024-10-15",
      tipoRecurso: "Ordinário",
      estado: "registado",
      observacoes: "Recurso recebido e registado no sistema",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    registado: "Registado",
    autuado: "Autuado",
    distribuido: "Distribuído",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      registoSchema.parse(formData);
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

    if (editingRegisto) {
      setRegistos(prev =>
        prev.map(r =>
          r.id === editingRegisto
            ? { ...r, ...formData, estado: "registado" }
            : r
        )
      );
      toast({
        title: "Registo atualizado",
        description: "O registo foi atualizado com sucesso.",
      });
      setEditingRegisto(null);
    } else {
      const novoRegisto: RegistoData = {
        id: Date.now().toString(),
        ...formData,
        estado: "registado",
      };
      setRegistos(prev => [...prev, novoRegisto]);
      toast({
        title: "Registo criado",
        description: `Recurso ${novoRegisto.numeroRecurso} foi registado com sucesso.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numeroRecurso: "",
      processoOriginal: "",
      dataRecebimento: "",
      recorrente: "",
      tipoRecurso: "",
      observacoes: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingRegisto(null);
  };

  const handleEdit = (registo: RegistoData) => {
    setFormData({
      numeroRecurso: registo.numeroRecurso,
      processoOriginal: registo.processoOriginal,
      dataRecebimento: registo.dataRecebimento,
      recorrente: registo.recorrente,
      tipoRecurso: registo.tipoRecurso,
      observacoes: registo.observacoes || "",
    });
    setEditingRegisto(registo.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este registo?")) {
      setRegistos(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Registo eliminado",
        description: "O registo foi eliminado com sucesso.",
      });
    }
  };

  const handleViewDetails = (registo: RegistoData) => {
    setSelectedRegisto(registo);
    setShowDetailDialog(true);
  };

  const filteredRegistos = registos.filter(registo => {
    const matchesSearch =
      registo.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registo.processoOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registo.recorrente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || registo.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "registado":
        return "default";
      case "autuado":
        return "secondary";
      case "distribuido":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Registo e Autuação</h1>
        <p className="text-muted-foreground">
          Registo e autuação de recursos ordinários
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Registos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{registos.length}</div>
              <div className="text-sm text-muted-foreground">Total de Registos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {registos.filter(r => r.estado === "registado").length}
              </div>
              <div className="text-sm text-muted-foreground">Registados</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {registos.filter(r => r.estado === "distribuido").length}
              </div>
              <div className="text-sm text-muted-foreground">Distribuídos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registos de Autuação</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Registo
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingRegisto ? "Editar Registo" : "Novo Registo de Recurso"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Número do Recurso *</Label>
                  <Input
                    placeholder="Ex: RO-2024-001"
                    value={formData.numeroRecurso}
                    onChange={(e) => handleInputChange("numeroRecurso", e.target.value)}
                    className={formErrors.numeroRecurso ? "border-red-500" : ""}
                  />
                  {formErrors.numeroRecurso && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.numeroRecurso}</p>
                  )}
                </div>
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
                  <Label>Data de Recebimento *</Label>
                  <Input
                    type="date"
                    value={formData.dataRecebimento}
                    onChange={(e) => handleInputChange("dataRecebimento", e.target.value)}
                    className={formErrors.dataRecebimento ? "border-red-500" : ""}
                  />
                  {formErrors.dataRecebimento && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataRecebimento}</p>
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
                  <Label>Tipo de Recurso *</Label>
                  <Select
                    value={formData.tipoRecurso}
                    onValueChange={(value) => handleInputChange("tipoRecurso", value)}
                  >
                    <SelectTrigger className={formErrors.tipoRecurso ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ordinário">Ordinário</SelectItem>
                      <SelectItem value="Inconstitucionalidade">Inconstitucionalidade</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.tipoRecurso && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.tipoRecurso}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Observações adicionais (opcional)"
                    rows={3}
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    className={formErrors.observacoes ? "border-red-500" : ""}
                  />
                  {formErrors.observacoes && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.observacoes}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSubmit}>
                  {editingRegisto ? "Atualizar" : "Registar"}
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
                <SelectItem value="registado">Registado</SelectItem>
                <SelectItem value="autuado">Autuado</SelectItem>
                <SelectItem value="distribuido">Distribuído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRegistos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum registo encontrado</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Processo Original</TableHead>
                    <TableHead>Recorrente</TableHead>
                    <TableHead>Data Recebimento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistos.map((registo) => (
                    <TableRow key={registo.id}>
                      <TableCell className="font-medium">{registo.numeroRecurso}</TableCell>
                      <TableCell>{registo.processoOriginal}</TableCell>
                      <TableCell>{registo.recorrente}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(registo.dataRecebimento).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(registo.estado)}>
                          {estadoLabels[registo.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(registo)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(registo)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(registo.id)}
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
            <DialogTitle>Detalhes do Registo</DialogTitle>
            <DialogDescription>
              Informações completas do registo de autuação
            </DialogDescription>
          </DialogHeader>
          {selectedRegisto && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Recurso</Label>
                  <p className="font-medium">{selectedRegisto.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Processo Original</Label>
                  <p className="font-medium">{selectedRegisto.processoOriginal}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Recorrente</Label>
                  <p className="font-medium">{selectedRegisto.recorrente}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Recebimento</Label>
                  <p className="font-medium">
                    {new Date(selectedRegisto.dataRecebimento).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo de Recurso</Label>
                  <p className="font-medium">{selectedRegisto.tipoRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={getEstadoBadgeVariant(selectedRegisto.estado)}>
                    {estadoLabels[selectedRegisto.estado]}
                  </Badge>
                </div>
              </div>
              {selectedRegisto.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="mt-1 text-sm">{selectedRegisto.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
