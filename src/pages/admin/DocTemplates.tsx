import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Tag, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DocTemplatesProps {
  onBack: () => void;
}

const tiposDocumento = [
  { value: "capa", label: "Capa de Processo" },
  { value: "oficio", label: "Ofício" },
  { value: "guia", label: "Guia de Cobrança" },
  { value: "despacho", label: "Despacho" },
];

const formatosDocumento = [
  { value: "docx", label: "Microsoft Word (.docx)" },
  { value: "pdf", label: "PDF (.pdf)" },
];

const placeholdersComuns = [
  { name: "{{numero_processo}}", description: "Número do processo" },
  { name: "{{data_atual}}", description: "Data atual" },
  { name: "{{nome_requerente}}", description: "Nome do requerente" },
  { name: "{{entidade}}", description: "Nome da entidade" },
  { name: "{{valor}}", description: "Valor monetário" },
  { name: "{{tipo_processo}}", description: "Tipo do processo" },
  { name: "{{juiz_relator}}", description: "Nome do juiz relator" },
  { name: "{{juiz_adjunto}}", description: "Nome do juiz adjunto" },
  { name: "{{ano}}", description: "Ano corrente" },
  { name: "{{emolumentos}}", description: "Valor de emolumentos" },
];

export default function DocTemplates({ onBack }: DocTemplatesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newPlaceholder, setNewPlaceholder] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    formato: "",
    versao: "1.0",
    ativo: true,
    placeholders: [] as string[]
  });

  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["doc-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doc_templates")
        .select("*")
        .order("tipo");
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("doc_templates")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doc-templates"] });
      toast.success("Template criado com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar template");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("doc_templates")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doc-templates"] });
      toast.success("Template atualizado com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar template");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("doc_templates")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doc-templates"] });
      toast.success("Template excluído com sucesso");
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir template");
    }
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      tipo: "",
      formato: "",
      versao: "1.0",
      ativo: true,
      placeholders: []
    });
    setNewPlaceholder("");
    setEditingTemplate(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      nome: template.nome,
      tipo: template.tipo,
      formato: template.formato,
      versao: template.versao,
      ativo: template.ativo,
      placeholders: template.placeholders || []
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleAddPlaceholder = () => {
    if (!newPlaceholder.trim()) return;
    
    const placeholder = newPlaceholder.trim();
    if (!formData.placeholders.includes(placeholder)) {
      setFormData({
        ...formData,
        placeholders: [...formData.placeholders, placeholder]
      });
      setNewPlaceholder("");
    }
  };

  const handleRemovePlaceholder = (placeholder: string) => {
    setFormData({
      ...formData,
      placeholders: formData.placeholders.filter(p => p !== placeholder)
    });
  };

  const handleAddCommonPlaceholder = (placeholder: string) => {
    if (!formData.placeholders.includes(placeholder)) {
      setFormData({
        ...formData,
        placeholders: [...formData.placeholders, placeholder]
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.tipo || !formData.formato || !formData.versao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const data = {
      nome: formData.nome,
      tipo: formData.tipo,
      formato: formData.formato,
      versao: formData.versao,
      ativo: formData.ativo,
      placeholders: formData.placeholders
    };

    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getTipoLabel = (tipo: string) => {
    return tiposDocumento.find(t => t.value === tipo)?.label || tipo;
  };

  const getFormatoLabel = (formato: string) => {
    return formatosDocumento.find(f => f.value === formato)?.label || formato;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Templates de Documentos</h1>
            <p className="text-muted-foreground">Gerir modelos de documentos com placeholders</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates Cadastrados</CardTitle>
          <CardDescription>Gerir templates de documentos do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Placeholders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates?.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {template.nome}
                      </div>
                    </TableCell>
                    <TableCell>{getTipoLabel(template.tipo)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.formato.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">v{template.versao}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {template.placeholders?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {template.ativo ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placeholders Comuns</CardTitle>
          <CardDescription>Variáveis disponíveis para uso nos templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {placeholdersComuns.map((ph) => (
              <div key={ph.name} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <code className="text-xs font-mono">{ph.name}</code>
                  <p className="text-xs text-muted-foreground">{ph.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Editar Template" : "Novo Template"}</DialogTitle>
            <DialogDescription>
              Configure o template de documento com placeholders personalizados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Template *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Ofício de Notificação"
                />
              </div>

              <div className="space-y-2">
                <Label>Versão *</Label>
                <Input
                  value={formData.versao}
                  onChange={(e) => setFormData({ ...formData, versao: e.target.value })}
                  placeholder="Ex: 1.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Documento *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato *</Label>
                <Select value={formData.formato} onValueChange={(value) => setFormData({ ...formData, formato: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatosDocumento.map((formato) => (
                      <SelectItem key={formato.value} value={formato.value}>{formato.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label>Template Ativo</Label>
            </div>

            <div className="space-y-2">
              <Label>Placeholders</Label>
              <div className="flex gap-2">
                <Input
                  value={newPlaceholder}
                  onChange={(e) => setNewPlaceholder(e.target.value)}
                  placeholder="Ex: {{nome_variavel}}"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPlaceholder();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddPlaceholder}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Placeholders Adicionados:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.placeholders.map((placeholder) => (
                    <Badge key={placeholder} variant="secondary" className="pr-1">
                      <code className="text-xs">{placeholder}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemovePlaceholder(placeholder)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Adicionar Placeholders Comuns:</p>
                <div className="flex flex-wrap gap-2">
                  {placeholdersComuns.map((ph) => (
                    <Button
                      key={ph.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCommonPlaceholder(ph.name)}
                      disabled={formData.placeholders.includes(ph.name)}
                    >
                      {ph.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Instruções:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Use placeholders no formato {'{{nome_variavel}}'}</li>
                <li>Os placeholders serão substituídos automaticamente</li>
                <li>Mantenha a versão atualizada ao fazer alterações</li>
                <li>Templates inativos não aparecerão na seleção</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingTemplate ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita e pode afetar processos que usam este modelo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
