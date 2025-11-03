import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye, Edit, Trash2, Download, Calendar, Gavel } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const resolucaoSchema = z.object({
  numeroRecurso: z.string().trim().min(1, "Número do recurso é obrigatório").max(50, "Máximo 50 caracteres"),
  dataSessao: z.string().min(1, "Data da sessão é obrigatória"),
  decisaoFinal: z.string().min(1, "Selecione a decisão final"),
  votacao: z.string().min(1, "Votação é obrigatória"),
  fundamentacao: z.string().trim().min(50, "Fundamentação deve ter pelo menos 50 caracteres").max(3000, "Máximo 3000 caracteres"),
  observacoes: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

type ResolucaoData = {
  id: string;
  numeroRecurso: string;
  dataSessao: string;
  decisaoFinal: string;
  votacao: string;
  fundamentacao: string;
  estado: string;
  observacoes?: string;
};

export default function ResolucaoPlenaria() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedResolucao, setSelectedResolucao] = useState<ResolucaoData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingResolucao, setEditingResolucao] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numeroRecurso: "",
    dataSessao: "",
    decisaoFinal: "",
    votacao: "",
    fundamentacao: "",
    observacoes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [resolucoes, setResolucoes] = useState<ResolucaoData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      dataSessao: "2024-12-01",
      decisaoFinal: "aprovado",
      votacao: "Unanimidade",
      fundamentacao: "O plenário decidiu, por unanimidade, dar provimento ao recurso...",
      estado: "aprovado",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    aguardando: "Aguardando Sessão",
    votacao: "Em Votação",
    aprovado: "Aprovado",
    rejeitado: "Rejeitado",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      resolucaoSchema.parse(formData);
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

    if (editingResolucao) {
      setResolucoes(prev =>
        prev.map(r =>
          r.id === editingResolucao
            ? { ...r, ...formData, estado: formData.decisaoFinal }
            : r
        )
      );
      toast({
        title: "Resolução atualizada",
        description: "A resolução plenária foi atualizada com sucesso.",
      });
      setEditingResolucao(null);
    } else {
      const novaResolucao: ResolucaoData = {
        id: Date.now().toString(),
        ...formData,
        estado: "aguardando",
      };
      setResolucoes(prev => [...prev, novaResolucao]);
      toast({
        title: "Resolução registada",
        description: `Resolução do recurso ${novaResolucao.numeroRecurso} foi registada.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numeroRecurso: "",
      dataSessao: "",
      decisaoFinal: "",
      votacao: "",
      fundamentacao: "",
      observacoes: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingResolucao(null);
  };

  const handleEdit = (resolucao: ResolucaoData) => {
    setFormData({
      numeroRecurso: resolucao.numeroRecurso,
      dataSessao: resolucao.dataSessao,
      decisaoFinal: resolucao.decisaoFinal,
      votacao: resolucao.votacao,
      fundamentacao: resolucao.fundamentacao,
      observacoes: resolucao.observacoes || "",
    });
    setEditingResolucao(resolucao.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar esta resolução?")) {
      setResolucoes(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Resolução eliminada",
        description: "A resolução foi eliminada com sucesso.",
      });
    }
  };

  const handleViewDetails = (resolucao: ResolucaoData) => {
    setSelectedResolucao(resolucao);
    setShowDetailDialog(true);
  };

  const filteredResolucoes = resolucoes.filter(resolucao => {
    const matchesSearch =
      resolucao.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || resolucao.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "aguardando":
        return "outline";
      case "votacao":
        return "secondary";
      case "aprovado":
        return "default";
      case "rejeitado":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resolução Plenária</h1>
        <p className="text-muted-foreground">
          Gestão de resoluções plenárias (sub-processo)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Resoluções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{resolucoes.length}</div>
              <div className="text-sm text-muted-foreground">Total de Resoluções</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {resolucoes.filter(r => r.estado === "aguardando").length}
              </div>
              <div className="text-sm text-muted-foreground">Aguardando</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {resolucoes.filter(r => r.estado === "aprovado").length}
              </div>
              <div className="text-sm text-muted-foreground">Aprovadas</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {resolucoes.filter(r => r.estado === "rejeitado").length}
              </div>
              <div className="text-sm text-muted-foreground">Rejeitadas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resoluções Plenárias</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Resolução
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingResolucao ? "Editar Resolução" : "Registar Nova Resolução Plenária"}
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
                  <Label>Decisão Final *</Label>
                  <Select
                    value={formData.decisaoFinal}
                    onValueChange={(value) => handleInputChange("decisaoFinal", value)}
                  >
                    <SelectTrigger className={formErrors.decisaoFinal ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a decisão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      <SelectItem value="parcialmente_aprovado">Parcialmente Aprovado</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.decisaoFinal && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.decisaoFinal}</p>
                  )}
                </div>
                <div>
                  <Label>Votação *</Label>
                  <Input
                    placeholder="Ex: Unanimidade ou 5-2"
                    value={formData.votacao}
                    onChange={(e) => handleInputChange("votacao", e.target.value)}
                    className={formErrors.votacao ? "border-red-500" : ""}
                  />
                  {formErrors.votacao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.votacao}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamentação *</Label>
                  <Textarea
                    placeholder="Fundamentação da decisão plenária (mínimo 50 caracteres)"
                    rows={6}
                    value={formData.fundamentacao}
                    onChange={(e) => handleInputChange("fundamentacao", e.target.value)}
                    className={formErrors.fundamentacao ? "border-red-500" : ""}
                  />
                  {formErrors.fundamentacao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fundamentacao}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fundamentacao.length}/3000 caracteres
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
                  {editingResolucao ? "Atualizar" : "Registar"}
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
                placeholder="Pesquisar por número de recurso..."
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
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="votacao">Em Votação</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredResolucoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gavel className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma resolução encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Data Sessão</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Votação</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResolucoes.map((resolucao) => (
                    <TableRow key={resolucao.id}>
                      <TableCell className="font-medium">{resolucao.numeroRecurso}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(resolucao.dataSessao).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={resolucao.decisaoFinal === "aprovado" ? "default" : "destructive"}>
                          {resolucao.decisaoFinal.replace("_", " ").charAt(0).toUpperCase() + 
                           resolucao.decisaoFinal.replace("_", " ").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{resolucao.votacao}</TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(resolucao.estado)}>
                          {estadoLabels[resolucao.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(resolucao)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(resolucao)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(resolucao.id)}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Resolução Plenária</DialogTitle>
            <DialogDescription>
              Informações completas da resolução
            </DialogDescription>
          </DialogHeader>
          {selectedResolucao && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Recurso</Label>
                  <p className="font-medium">{selectedResolucao.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data da Sessão</Label>
                  <p className="font-medium">
                    {new Date(selectedResolucao.dataSessao).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Decisão Final</Label>
                  <Badge variant={selectedResolucao.decisaoFinal === "aprovado" ? "default" : "destructive"}>
                    {selectedResolucao.decisaoFinal.replace("_", " ").charAt(0).toUpperCase() + 
                     selectedResolucao.decisaoFinal.replace("_", " ").slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Votação</Label>
                  <p className="font-medium">{selectedResolucao.votacao}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={getEstadoBadgeVariant(selectedResolucao.estado)}>
                    {estadoLabels[selectedResolucao.estado]}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Fundamentação</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedResolucao.fundamentacao}</p>
              </div>
              {selectedResolucao.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="mt-1 text-sm">{selectedResolucao.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
