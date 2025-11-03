import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye, Edit, Trash2, Download, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const plenarioSchema = z.object({
  numeroRecurso: z.string().trim().min(1, "Número do recurso é obrigatório").max(50, "Máximo 50 caracteres"),
  dataSessao: z.string().min(1, "Data da sessão é obrigatória"),
  juizRelator: z.string().min(1, "Selecione o juiz relator"),
  decisaoPlenario: z.string().min(1, "Selecione a decisão"),
  fundamentacao: z.string().trim().min(20, "Fundamentação deve ter pelo menos 20 caracteres").max(2000, "Máximo 2000 caracteres"),
  observacoes: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

type PlenarioData = {
  id: string;
  numeroRecurso: string;
  dataSessao: string;
  juizRelator: string;
  decisaoPlenario: string;
  fundamentacao: string;
  estado: string;
  observacoes?: string;
};

export default function PlenarioCamara() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedPlenario, setSelectedPlenario] = useState<PlenarioData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingPlenario, setEditingPlenario] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numeroRecurso: "",
    dataSessao: "",
    juizRelator: "",
    decisaoPlenario: "",
    fundamentacao: "",
    observacoes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [plenarios, setPlenarios] = useState<PlenarioData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      dataSessao: "2024-11-05",
      juizRelator: "Dr. João Silva",
      decisaoPlenario: "aprovado",
      fundamentacao: "O plenário da câmara decidiu aprovar o recurso com base nos fundamentos apresentados...",
      estado: "concluido",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    agendado: "Agendado",
    andamento: "Em Andamento",
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
      plenarioSchema.parse(formData);
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

    if (editingPlenario) {
      setPlenarios(prev =>
        prev.map(p =>
          p.id === editingPlenario
            ? { ...p, ...formData, estado: "concluido" }
            : p
        )
      );
      toast({
        title: "Sessão atualizada",
        description: "A sessão do plenário foi atualizada com sucesso.",
      });
      setEditingPlenario(null);
    } else {
      const novoPlenario: PlenarioData = {
        id: Date.now().toString(),
        ...formData,
        estado: "agendado",
      };
      setPlenarios(prev => [...prev, novoPlenario]);
      toast({
        title: "Sessão registada",
        description: `Sessão para o recurso ${novoPlenario.numeroRecurso} foi registada.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numeroRecurso: "",
      dataSessao: "",
      juizRelator: "",
      decisaoPlenario: "",
      fundamentacao: "",
      observacoes: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingPlenario(null);
  };

  const handleEdit = (plenario: PlenarioData) => {
    setFormData({
      numeroRecurso: plenario.numeroRecurso,
      dataSessao: plenario.dataSessao,
      juizRelator: plenario.juizRelator,
      decisaoPlenario: plenario.decisaoPlenario,
      fundamentacao: plenario.fundamentacao,
      observacoes: plenario.observacoes || "",
    });
    setEditingPlenario(plenario.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar esta sessão?")) {
      setPlenarios(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sessão eliminada",
        description: "A sessão foi eliminada com sucesso.",
      });
    }
  };

  const handleViewDetails = (plenario: PlenarioData) => {
    setSelectedPlenario(plenario);
    setShowDetailDialog(true);
  };

  const filteredPlenarios = plenarios.filter(plenario => {
    const matchesSearch =
      plenario.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plenario.juizRelator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || plenario.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "agendado":
        return "outline";
      case "andamento":
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
        <h1 className="text-3xl font-bold mb-2">Plenário da Câmara</h1>
        <p className="text-muted-foreground">
          Gestão de sessões do plenário da câmara para recursos ordinários
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{plenarios.length}</div>
              <div className="text-sm text-muted-foreground">Total de Sessões</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {plenarios.filter(p => p.estado === "agendado").length}
              </div>
              <div className="text-sm text-muted-foreground">Agendadas</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {plenarios.filter(p => p.estado === "concluido").length}
              </div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sessões do Plenário</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Sessão
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingPlenario ? "Editar Sessão" : "Registar Nova Sessão do Plenário"}
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
                  <Label>Data da Sessão *</Label>
                  <Input
                    type="date"
                    value={formData.dataSessao}
                    onChange={(e) => handleInputChange("dataSessao", e.target.value)}
                    className={formErrors.dataSessao ? "border-red-500" : ""}
                  />
                  {formErrors.dataSessao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataSessao}</p>
                  )}
                </div>
                <div>
                  <Label>Juiz Relator *</Label>
                  <Select
                    value={formData.juizRelator}
                    onValueChange={(value) => handleInputChange("juizRelator", value)}
                  >
                    <SelectTrigger className={formErrors.juizRelator ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o juiz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                      <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                      <SelectItem value="Dr. António Costa">Dr. António Costa</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.juizRelator && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.juizRelator}</p>
                  )}
                </div>
                <div>
                  <Label>Decisão do Plenário *</Label>
                  <Select
                    value={formData.decisaoPlenario}
                    onValueChange={(value) => handleInputChange("decisaoPlenario", value)}
                  >
                    <SelectTrigger className={formErrors.decisaoPlenario ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a decisão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      <SelectItem value="adiado">Adiado</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.decisaoPlenario && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.decisaoPlenario}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamentação *</Label>
                  <Textarea
                    placeholder="Fundamentação da decisão (mínimo 20 caracteres)"
                    rows={4}
                    value={formData.fundamentacao}
                    onChange={(e) => handleInputChange("fundamentacao", e.target.value)}
                    className={formErrors.fundamentacao ? "border-red-500" : ""}
                  />
                  {formErrors.fundamentacao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fundamentacao}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fundamentacao.length}/2000 caracteres
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Observações adicionais (opcional)"
                    rows={2}
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    className={formErrors.observacoes ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSubmit}>
                  {editingPlenario ? "Atualizar" : "Registar"}
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
                placeholder="Pesquisar por número de recurso ou juiz relator..."
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
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPlenarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma sessão encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Data Sessão</TableHead>
                    <TableHead>Juiz Relator</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlenarios.map((plenario) => (
                    <TableRow key={plenario.id}>
                      <TableCell className="font-medium">{plenario.numeroRecurso}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(plenario.dataSessao).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>{plenario.juizRelator}</TableCell>
                      <TableCell>
                        <Badge variant={plenario.decisaoPlenario === "aprovado" ? "default" : "destructive"}>
                          {plenario.decisaoPlenario.charAt(0).toUpperCase() + plenario.decisaoPlenario.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(plenario.estado)}>
                          {estadoLabels[plenario.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(plenario)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(plenario)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(plenario.id)}
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
            <DialogTitle>Detalhes da Sessão do Plenário</DialogTitle>
            <DialogDescription>
              Informações completas da sessão
            </DialogDescription>
          </DialogHeader>
          {selectedPlenario && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Recurso</Label>
                  <p className="font-medium">{selectedPlenario.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data da Sessão</Label>
                  <p className="font-medium">
                    {new Date(selectedPlenario.dataSessao).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Juiz Relator</Label>
                  <p className="font-medium">{selectedPlenario.juizRelator}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Decisão</Label>
                  <Badge variant={selectedPlenario.decisaoPlenario === "aprovado" ? "default" : "destructive"}>
                    {selectedPlenario.decisaoPlenario.charAt(0).toUpperCase() + selectedPlenario.decisaoPlenario.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={getEstadoBadgeVariant(selectedPlenario.estado)}>
                    {estadoLabels[selectedPlenario.estado]}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Fundamentação</Label>
                <p className="mt-1 text-sm">{selectedPlenario.fundamentacao}</p>
              </div>
              {selectedPlenario.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="mt-1 text-sm">{selectedPlenario.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
