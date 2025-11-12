import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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

interface RegrasDistribuicaoProps {
  onBack: () => void;
}

const tiposProcesso = [
  "Visto",
  "PrestacaoContas",
  "PrestacaoContasSoberania",
  "AutonomoMulta",
  "FiscalizacaoOGE",
  "Recurso"
];

const criterios = [
  "LetraJuiz",
  "Carga",
  "NaturezaEntidade",
  "FonteFinanciamento"
];

export default function RegrasDistribuicao({ onBack }: RegrasDistribuicaoProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRegra, setEditingRegra] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo_processo: "",
    criterio: "",
    parametros: "{}",
    ativo: true
  });

  const queryClient = useQueryClient();

  const { data: regras, isLoading } = useQuery({
    queryKey: ["regras-distribuicao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regras_distribuicao")
        .select("*")
        .order("tipo_processo");
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("regras_distribuicao")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regras-distribuicao"] });
      toast.success("Regra criada com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar regra");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("regras_distribuicao")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regras-distribuicao"] });
      toast.success("Regra atualizada com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar regra");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("regras_distribuicao")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regras-distribuicao"] });
      toast.success("Regra excluída com sucesso");
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir regra");
    }
  });

  const resetForm = () => {
    setFormData({
      tipo_processo: "",
      criterio: "",
      parametros: "{}",
      ativo: true
    });
    setEditingRegra(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (regra: any) => {
    setEditingRegra(regra);
    setFormData({
      tipo_processo: regra.tipo_processo,
      criterio: regra.criterio,
      parametros: JSON.stringify(regra.parametros || {}, null, 2),
      ativo: regra.ativo
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    let parametros;
    try {
      parametros = JSON.parse(formData.parametros);
    } catch (e) {
      toast.error("Parâmetros JSON inválidos");
      return;
    }

    const data = {
      tipo_processo: formData.tipo_processo,
      criterio: formData.criterio,
      parametros,
      ativo: formData.ativo
    };

    if (editingRegra) {
      updateMutation.mutate({ id: editingRegra.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Regras de Distribuição</h1>
            <p className="text-muted-foreground">Configurar distribuição automática de processos</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Regra
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regras Cadastradas</CardTitle>
          <CardDescription>Gerir regras de distribuição por tipo de processo</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Processo</TableHead>
                  <TableHead>Critério</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regras?.map((regra) => (
                  <TableRow key={regra.id}>
                    <TableCell className="font-medium">{regra.tipo_processo}</TableCell>
                    <TableCell>{regra.criterio}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        regra.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {regra.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(regra)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(regra.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRegra ? "Editar Regra" : "Nova Regra"}</DialogTitle>
            <DialogDescription>
              Configure a regra de distribuição para o tipo de processo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Processo</Label>
              <Select value={formData.tipo_processo} onValueChange={(value) => setFormData({ ...formData, tipo_processo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposProcesso.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Critério de Distribuição</Label>
              <Select value={formData.criterio} onValueChange={(value) => setFormData({ ...formData, criterio: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o critério" />
                </SelectTrigger>
                <SelectContent>
                  {criterios.map((criterio) => (
                    <SelectItem key={criterio} value={criterio}>{criterio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Parâmetros (JSON)</Label>
              <Textarea
                value={formData.parametros}
                onChange={(e) => setFormData({ ...formData, parametros: e.target.value })}
                rows={6}
                placeholder='{"exemplo": "valor"}'
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label>Regra Ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingRegra ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta regra? Esta ação não pode ser desfeita.
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
