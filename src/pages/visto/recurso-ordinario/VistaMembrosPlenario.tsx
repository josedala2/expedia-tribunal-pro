import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye, Edit, Trash2, Download, Calendar, UserCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const vistaSchema = z.object({
  numeroRecurso: z.string().trim().min(1, "Número do recurso é obrigatório").max(50, "Máximo 50 caracteres"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().min(1, "Data de fim é obrigatória"),
  membroDesignado: z.string().min(1, "Selecione o membro designado"),
  prazoAnalise: z.string().min(1, "Prazo de análise é obrigatório"),
  parecerMembro: z.string().max(2000, "Máximo 2000 caracteres").optional(),
});

type VistaData = {
  id: string;
  numeroRecurso: string;
  dataInicio: string;
  dataFim: string;
  membroDesignado: string;
  prazoAnalise: string;
  estado: string;
  parecerMembro?: string;
};

export default function VistaMembrosPlenario() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedVista, setSelectedVista] = useState<VistaData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingVista, setEditingVista] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numeroRecurso: "",
    dataInicio: "",
    dataFim: "",
    membroDesignado: "",
    prazoAnalise: "",
    parecerMembro: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [vistas, setVistas] = useState<VistaData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      dataInicio: "2024-11-15",
      dataFim: "2024-11-30",
      membroDesignado: "Dra. Ana Costa",
      prazoAnalise: "15",
      estado: "em_analise",
      parecerMembro: "Concordo com o projeto de acórdão apresentado...",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    pendente: "Pendente",
    em_analise: "Em Análise",
    concluido: "Concluído",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      vistaSchema.parse(formData);
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

    if (editingVista) {
      setVistas(prev =>
        prev.map(v =>
          v.id === editingVista
            ? { ...v, ...formData, estado: formData.parecerMembro ? "concluido" : "em_analise" }
            : v
        )
      );
      toast({
        title: "Vista atualizada",
        description: "A vista foi atualizada com sucesso.",
      });
      setEditingVista(null);
    } else {
      const novaVista: VistaData = {
        id: Date.now().toString(),
        ...formData,
        estado: "pendente",
      };
      setVistas(prev => [...prev, novaVista]);
      toast({
        title: "Vista registada",
        description: `Vista do recurso ${novaVista.numeroRecurso} foi registada.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numeroRecurso: "",
      dataInicio: "",
      dataFim: "",
      membroDesignado: "",
      prazoAnalise: "",
      parecerMembro: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingVista(null);
  };

  const handleEdit = (vista: VistaData) => {
    setFormData({
      numeroRecurso: vista.numeroRecurso,
      dataInicio: vista.dataInicio,
      dataFim: vista.dataFim,
      membroDesignado: vista.membroDesignado,
      prazoAnalise: vista.prazoAnalise,
      parecerMembro: vista.parecerMembro || "",
    });
    setEditingVista(vista.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar esta vista?")) {
      setVistas(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Vista eliminada",
        description: "A vista foi eliminada com sucesso.",
      });
    }
  };

  const handleViewDetails = (vista: VistaData) => {
    setSelectedVista(vista);
    setShowDetailDialog(true);
  };

  const filteredVistas = vistas.filter(vista => {
    const matchesSearch =
      vista.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vista.membroDesignado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || vista.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "pendente":
        return "outline";
      case "em_analise":
        return "secondary";
      case "concluido":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vista aos Membros do Plenário</h1>
        <p className="text-muted-foreground">
          Gestão de vistas aos membros do tribunal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Vistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{vistas.length}</div>
              <div className="text-sm text-muted-foreground">Total de Vistas</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {vistas.filter(v => v.estado === "em_analise").length}
              </div>
              <div className="text-sm text-muted-foreground">Em Análise</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {vistas.filter(v => v.estado === "concluido").length}
              </div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vistas Registadas</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Vista
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingVista ? "Editar Vista" : "Registar Nova Vista"}
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
                  <Label>Membro Designado *</Label>
                  <Select
                    value={formData.membroDesignado}
                    onValueChange={(value) => handleInputChange("membroDesignado", value)}
                  >
                    <SelectTrigger className={formErrors.membroDesignado ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o membro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                      <SelectItem value="Dr. Paulo Fernandes">Dr. Paulo Fernandes</SelectItem>
                      <SelectItem value="Dra. Isabel Rodrigues">Dra. Isabel Rodrigues</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.membroDesignado && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.membroDesignado}</p>
                  )}
                </div>
                <div>
                  <Label>Data de Início *</Label>
                  <Input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => handleInputChange("dataInicio", e.target.value)}
                    className={formErrors.dataInicio ? "border-red-500" : ""}
                  />
                  {formErrors.dataInicio && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataInicio}</p>
                  )}
                </div>
                <div>
                  <Label>Data de Fim *</Label>
                  <Input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => handleInputChange("dataFim", e.target.value)}
                    className={formErrors.dataFim ? "border-red-500" : ""}
                  />
                  {formErrors.dataFim && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataFim}</p>
                  )}
                </div>
                <div>
                  <Label>Prazo de Análise (dias) *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 15"
                    value={formData.prazoAnalise}
                    onChange={(e) => handleInputChange("prazoAnalise", e.target.value)}
                    className={formErrors.prazoAnalise ? "border-red-500" : ""}
                  />
                  {formErrors.prazoAnalise && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.prazoAnalise}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Parecer do Membro</Label>
                  <Textarea
                    placeholder="Parecer do membro (opcional)"
                    rows={4}
                    value={formData.parecerMembro}
                    onChange={(e) => handleInputChange("parecerMembro", e.target.value)}
                    className={formErrors.parecerMembro ? "border-red-500" : ""}
                  />
                  {formErrors.parecerMembro && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.parecerMembro}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSubmit}>
                  {editingVista ? "Atualizar" : "Registar"}
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
                placeholder="Pesquisar por número de recurso ou membro..."
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
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredVistas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma vista encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Membro Designado</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Fim</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVistas.map((vista) => (
                    <TableRow key={vista.id}>
                      <TableCell className="font-medium">{vista.numeroRecurso}</TableCell>
                      <TableCell>{vista.membroDesignado}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(vista.dataInicio).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(vista.dataFim).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(vista.estado)}>
                          {estadoLabels[vista.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(vista)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(vista)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(vista.id)}
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
            <DialogTitle>Detalhes da Vista</DialogTitle>
            <DialogDescription>
              Informações completas da vista aos membros
            </DialogDescription>
          </DialogHeader>
          {selectedVista && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Recurso</Label>
                  <p className="font-medium">{selectedVista.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Membro Designado</Label>
                  <p className="font-medium">{selectedVista.membroDesignado}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Início</Label>
                  <p className="font-medium">
                    {new Date(selectedVista.dataInicio).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Fim</Label>
                  <p className="font-medium">
                    {new Date(selectedVista.dataFim).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prazo de Análise</Label>
                  <p className="font-medium">{selectedVista.prazoAnalise} dias</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={getEstadoBadgeVariant(selectedVista.estado)}>
                    {estadoLabels[selectedVista.estado]}
                  </Badge>
                </div>
              </div>
              {selectedVista.parecerMembro && (
                <div>
                  <Label className="text-muted-foreground">Parecer do Membro</Label>
                  <p className="mt-1 text-sm">{selectedVista.parecerMembro}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
