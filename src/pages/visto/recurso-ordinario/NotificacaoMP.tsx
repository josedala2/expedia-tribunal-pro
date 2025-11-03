import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye, Edit, Trash2, Download, Calendar, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const notificacaoSchema = z.object({
  numeroRecurso: z.string().trim().min(1, "Número do recurso é obrigatório").max(50, "Máximo 50 caracteres"),
  dataNotificacao: z.string().min(1, "Data de notificação é obrigatória"),
  destinatario: z.string().min(1, "Selecione o destinatário"),
  tipoNotificacao: z.string().min(1, "Selecione o tipo"),
  conteudo: z.string().trim().min(20, "Conteúdo deve ter pelo menos 20 caracteres").max(2000, "Máximo 2000 caracteres"),
  observacoes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type NotificacaoData = {
  id: string;
  numeroRecurso: string;
  dataNotificacao: string;
  destinatario: string;
  tipoNotificacao: string;
  conteudo: string;
  estado: string;
  observacoes?: string;
};

export default function NotificacaoMP() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedNotificacao, setSelectedNotificacao] = useState<NotificacaoData | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingNotificacao, setEditingNotificacao] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numeroRecurso: "",
    dataNotificacao: "",
    destinatario: "",
    tipoNotificacao: "",
    conteudo: "",
    observacoes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [notificacoes, setNotificacoes] = useState<NotificacaoData[]>([
    {
      id: "1",
      numeroRecurso: "RO-2024-001",
      dataNotificacao: "2024-12-05",
      destinatario: "Ministério Público",
      tipoNotificacao: "decisao",
      conteudo: "Notifica-se que o recurso ordinário nº RO-2024-001 foi decidido...",
      estado: "enviada",
    },
  ]);

  const estadoLabels: Record<string, string> = {
    rascunho: "Rascunho",
    aguardando: "Aguardando Envio",
    enviada: "Enviada",
    recebida: "Recebida",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      notificacaoSchema.parse(formData);
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

    if (editingNotificacao) {
      setNotificacoes(prev =>
        prev.map(n =>
          n.id === editingNotificacao
            ? { ...n, ...formData }
            : n
        )
      );
      toast({
        title: "Notificação atualizada",
        description: "A notificação foi atualizada com sucesso.",
      });
      setEditingNotificacao(null);
    } else {
      const novaNotificacao: NotificacaoData = {
        id: Date.now().toString(),
        ...formData,
        estado: "rascunho",
      };
      setNotificacoes(prev => [...prev, novaNotificacao]);
      toast({
        title: "Notificação criada",
        description: `Notificação para o recurso ${novaNotificacao.numeroRecurso} foi criada.`,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numeroRecurso: "",
      dataNotificacao: "",
      destinatario: "",
      tipoNotificacao: "",
      conteudo: "",
      observacoes: "",
    });
    setFormErrors({});
    setShowForm(false);
    setEditingNotificacao(null);
  };

  const handleEdit = (notificacao: NotificacaoData) => {
    setFormData({
      numeroRecurso: notificacao.numeroRecurso,
      dataNotificacao: notificacao.dataNotificacao,
      destinatario: notificacao.destinatario,
      tipoNotificacao: notificacao.tipoNotificacao,
      conteudo: notificacao.conteudo,
      observacoes: notificacao.observacoes || "",
    });
    setEditingNotificacao(notificacao.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar esta notificação?")) {
      setNotificacoes(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Notificação eliminada",
        description: "A notificação foi eliminada com sucesso.",
      });
    }
  };

  const handleViewDetails = (notificacao: NotificacaoData) => {
    setSelectedNotificacao(notificacao);
    setShowDetailDialog(true);
  };

  const filteredNotificacoes = notificacoes.filter(notificacao => {
    const matchesSearch =
      notificacao.numeroRecurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notificacao.destinatario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === "todos" || notificacao.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "rascunho":
        return "outline";
      case "aguardando":
        return "secondary";
      case "enviada":
        return "default";
      case "recebida":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notificação ao MP e Entidade Pública</h1>
        <p className="text-muted-foreground">
          Gestão de notificações aos recorrentes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{notificacoes.length}</div>
              <div className="text-sm text-muted-foreground">Total de Notificações</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {notificacoes.filter(n => n.estado === "rascunho").length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {notificacoes.filter(n => n.estado === "enviada").length}
              </div>
              <div className="text-sm text-muted-foreground">Enviadas</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {notificacoes.filter(n => n.estado === "recebida").length}
              </div>
              <div className="text-sm text-muted-foreground">Recebidas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notificações Registadas</CardTitle>
          <Button onClick={() => { setShowForm(true); resetForm(); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Notificação
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-6 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-4">
                {editingNotificacao ? "Editar Notificação" : "Nova Notificação"}
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
                  <Label>Data de Notificação *</Label>
                  <Input
                    type="date"
                    value={formData.dataNotificacao}
                    onChange={(e) => handleInputChange("dataNotificacao", e.target.value)}
                    className={formErrors.dataNotificacao ? "border-red-500" : ""}
                  />
                  {formErrors.dataNotificacao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.dataNotificacao}</p>
                  )}
                </div>
                <div>
                  <Label>Destinatário *</Label>
                  <Select
                    value={formData.destinatario}
                    onValueChange={(value) => handleInputChange("destinatario", value)}
                  >
                    <SelectTrigger className={formErrors.destinatario ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ministério Público">Ministério Público</SelectItem>
                      <SelectItem value="Entidade Pública">Entidade Pública</SelectItem>
                      <SelectItem value="Ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.destinatario && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.destinatario}</p>
                  )}
                </div>
                <div>
                  <Label>Tipo de Notificação *</Label>
                  <Select
                    value={formData.tipoNotificacao}
                    onValueChange={(value) => handleInputChange("tipoNotificacao", value)}
                  >
                    <SelectTrigger className={formErrors.tipoNotificacao ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decisao">Decisão</SelectItem>
                      <SelectItem value="audiencia">Audiência</SelectItem>
                      <SelectItem value="informacao">Informação</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.tipoNotificacao && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.tipoNotificacao}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Conteúdo da Notificação *</Label>
                  <Textarea
                    placeholder="Conteúdo da notificação (mínimo 20 caracteres)"
                    rows={5}
                    value={formData.conteudo}
                    onChange={(e) => handleInputChange("conteudo", e.target.value)}
                    className={formErrors.conteudo ? "border-red-500" : ""}
                  />
                  {formErrors.conteudo && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.conteudo}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.conteudo.length}/2000 caracteres
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
                  {editingNotificacao ? "Atualizar" : "Criar Notificação"}
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
                placeholder="Pesquisar por número de recurso ou destinatário..."
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
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="recebida">Recebida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredNotificacoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Send className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Recurso</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotificacoes.map((notificacao) => (
                    <TableRow key={notificacao.id}>
                      <TableCell className="font-medium">{notificacao.numeroRecurso}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(notificacao.dataNotificacao).toLocaleDateString("pt-PT")}
                        </div>
                      </TableCell>
                      <TableCell>{notificacao.destinatario}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {notificacao.tipoNotificacao.charAt(0).toUpperCase() + notificacao.tipoNotificacao.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(notificacao.estado)}>
                          {estadoLabels[notificacao.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(notificacao)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(notificacao)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(notificacao.id)}
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
            <DialogTitle>Detalhes da Notificação</DialogTitle>
            <DialogDescription>
              Informações completas da notificação
            </DialogDescription>
          </DialogHeader>
          {selectedNotificacao && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número do Recurso</Label>
                  <p className="font-medium">{selectedNotificacao.numeroRecurso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Notificação</Label>
                  <p className="font-medium">
                    {new Date(selectedNotificacao.dataNotificacao).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Destinatário</Label>
                  <p className="font-medium">{selectedNotificacao.destinatario}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <Badge variant="outline">
                    {selectedNotificacao.tipoNotificacao.charAt(0).toUpperCase() + 
                     selectedNotificacao.tipoNotificacao.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={getEstadoBadgeVariant(selectedNotificacao.estado)}>
                    {estadoLabels[selectedNotificacao.estado]}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Conteúdo</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedNotificacao.conteudo}</p>
              </div>
              {selectedNotificacao.observacoes && (
                <div>
                  <Label className="text-muted-foreground">Observações</Label>
                  <p className="mt-1 text-sm">{selectedNotificacao.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
