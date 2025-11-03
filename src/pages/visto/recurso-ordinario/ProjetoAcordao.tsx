import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye, Edit, Trash2, Download, Calendar, File } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const projetoSchema = z.object({
  numeroRecurso: z.string().trim().min(1, "Número do recurso é obrigatório").max(50, "Máximo 50 caracteres"),
  dataElaboracao: z.string().min(1, "Data de elaboração é obrigatória"),
  elaboradoPor: z.string().min(1, "Selecione quem elaborou"),
  sentidoDecisao: z.string().min(1, "Selecione o sentido da decisão"),
  fundamentoJuridico: z.string().trim().min(50, "Fundamento deve ter pelo menos 50 caracteres").max(3000, "Máximo 3000 caracteres"),
  observacoes: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

type ProjetoData = {
  id: string;
  numeroRecurso: string;
  dataElaboracao: string;
  elaboradoPor: string;
  sentidoDecisao: string;
  fundamentoJuridico: string;
  estado: string;
  observacoes?: string;
};

export default function ProjetoAcordao() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedProjeto, setSelectedProjeto] = useState<ProjetoData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numeroRecurso: "",
    dataElaboracao: "",
    elaboradoPor: "",
    sentidoDecisao: "",
    fundamentoJuridico: "",
    observacoes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [projetos, setProjetos] = useState<ProjetoData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      dataElaboracao: "2024-11-10",
      elaboradoPor: "Dr. João Silva",
      sentidoDecisao: "provimento",
      fundamentoJuridico: "Com base nos artigos constitucionais e na jurisprudência...",
      estado: "elaboracao",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    elaboracao: "Em Elaboração",
    revisao: "Em Revisão",
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
      projetoSchema.parse(formData);
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

    if (editingProjeto) {
      setProjetos(prev =>
        prev.map(p =>
          p.id === editingProjeto
            ? { ...p, ...formData, estado: "revisao" }
            : p
        )
      );
      toast({
        title: "Projeto atualizado",
        description: "O projeto de acórdão foi atualizado com sucesso.",
      });
      setEditingProjeto(null);
    } else {
      const novoProjeto: ProjetoData = {
        id: Date.now().toString(),
        ...formData,
        estado: "elaboracao",
      };
      setProjetos(prev => [...prev, novoProjeto]);
      toast({
        title: "Projeto criado",
        description: `Projeto de acórdão para o recurso ${novoProjeto.numeroRecurso} foi criado.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numeroRecurso: "",
      dataElaboracao: "",
      elaboradoPor: "",
      sentidoDecisao: "",
      fundamentoJuridico: "",
      observacoes: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingProjeto(null);
  };

  const handleEdit = (projeto: ProjetoData) => {
    setFormData({
      numeroRecurso: projeto.numeroRecurso,
      dataElaboracao: projeto.dataElaboracao,
      elaboradoPor: projeto.elaboradoPor,
      sentidoDecisao: projeto.sentidoDecisao,
      fundamentoJuridico: projeto.fundamentoJuridico,
      observacoes: projeto.observacoes || "",
    });
    setEditingProjeto(projeto.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este projeto?")) {
      setProjetos(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Projeto eliminado",
        description: "O projeto foi eliminado com sucesso.",
      });
    }
  };

  const handleViewDetails = (projeto: ProjetoData) => {
    setSelectedProjeto(projeto);
    setShowDetailDialog(true);
  };

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch =
      projeto.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.elaboradoPor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || projeto.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "elaboracao":
        return "outline";
      case "revisao":
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
        <h1 className="text-3xl font-bold mb-2">Projeto de Acórdão</h1>
        <p className="text-muted-foreground">
          Elaboração e gestão de projetos de acórdão
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{projetos.length}</div>
              <div className="text-sm text-muted-foreground">Total de Projetos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {projetos.filter(p => p.estado === "elaboracao").length}
              </div>
              <div className="text-sm text-muted-foreground">Em Elaboração</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {projetos.filter(p => p.estado === "revisao").length}
              </div>
              <div className="text-sm text-muted-foreground">Em Revisão</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {projetos.filter(p => p.estado === "aprovado").length}
              </div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projetos de Acórdão</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingProjeto ? "Editar Projeto" : "Novo Projeto de Acórdão"}
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
                  <Label>Data de Elaboração *</Label>
                  <Input
                    type="date"
                    value={formData.dataElaboracao}
                    onChange={(e) => handleInputChange("dataElaboracao", e.target.value)}
                    className={formErrors.dataElaboracao ? "border-red-500" : ""}
                  />
                  {formErrors.dataElaboracao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataElaboracao}</p>
                  )}
                </div>
                <div>
                  <Label>Elaborado Por *</Label>
                  <Select
                    value={formData.elaboradoPor}
                    onValueChange={(value) => handleInputChange("elaboradoPor", value)}
                  >
                    <SelectTrigger className={formErrors.elaboradoPor ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                      <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                      <SelectItem value="Dr. António Costa">Dr. António Costa</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.elaboradoPor && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.elaboradoPor}</p>
                  )}
                </div>
                <div>
                  <Label>Sentido da Decisão *</Label>
                  <Select
                    value={formData.sentidoDecisao}
                    onValueChange={(value) => handleInputChange("sentidoDecisao", value)}
                  >
                    <SelectTrigger className={formErrors.sentidoDecisao ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="provimento">Provimento</SelectItem>
                      <SelectItem value="improvimento">Improvimento</SelectItem>
                      <SelectItem value="provimento_parcial">Provimento Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.sentidoDecisao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.sentidoDecisao}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Fundamento Jurídico *</Label>
                  <Textarea
                    placeholder="Fundamento jurídico da decisão (mínimo 50 caracteres)"
                    rows={6}
                    value={formData.fundamentoJuridico}
                    onChange={(e) => handleInputChange("fundamentoJuridico", e.target.value)}
                    className={formErrors.fundamentoJuridico ? "border-red-500" : ""}
                  />
                  {formErrors.fundamentoJuridico && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fundamentoJuridico}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.fundamentoJuridico.length}/3000 caracteres
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
                  {editingProjeto ? "Atualizar" : "Criar Projeto"}
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
                placeholder="Pesquisar por número de recurso ou elaborador..."
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
                <SelectItem value="elaboracao">Em Elaboração</SelectItem>
                <SelectItem value="revisao">Em Revisão</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProjetos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum projeto encontrado</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Data Elaboração</TableHead>
                    <TableHead>Elaborado Por</TableHead>
                    <TableHead>Sentido</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjetos.map((projeto) => (
                    <TableRow key={projeto.id}>
                      <TableCell className="font-medium">{projeto.numeroRecurso}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(projeto.dataElaboracao).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>{projeto.elaboradoPor}</TableCell>
                      <TableCell>
                        <Badge variant={projeto.sentidoDecisao === "provimento" ? "default" : "secondary"}>
                          {projeto.sentidoDecisao.replace("_", " ").charAt(0).toUpperCase() + 
                           projeto.sentidoDecisao.replace("_", " ").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(projeto.estado)}>
                          {estadoLabels[projeto.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(projeto)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(projeto)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(projeto.id)}
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
            <DialogTitle>Detalhes do Projeto de Acórdão</DialogTitle>
            <DialogDescription>
              Informações completas do projeto
            </DialogDescription>
          </DialogHeader>
          {selectedProjeto && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Recurso</Label>
                  <p className="font-medium">{selectedProjeto.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Elaboração</Label>
                  <p className="font-medium">
                    {new Date(selectedProjeto.dataElaboracao).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Elaborado Por</Label>
                  <p className="font-medium">{selectedProjeto.elaboradoPor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sentido da Decisão</Label>
                  <Badge variant={selectedProjeto.sentidoDecisao === "provimento" ? "default" : "secondary"}>
                    {selectedProjeto.sentidoDecisao.replace("_", " ").charAt(0).toUpperCase() + 
                     selectedProjeto.sentidoDecisao.replace("_", " ").slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={getEstadoBadgeVariant(selectedProjeto.estado)}>
                    {estadoLabels[selectedProjeto.estado]}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Fundamento Jurídico</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedProjeto.fundamentoJuridico}</p>
              </div>
              {selectedProjeto.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="mt-1 text-sm">{selectedProjeto.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
