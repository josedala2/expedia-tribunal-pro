import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2, Calculator } from "lucide-react";
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

interface EmolumentosTabelaProps {
  onBack: () => void;
}

const tiposProcesso = [
  "Visto",
  "PrestacaoContas",
  "PrestacaoContasSoberania",
  "AutonomoMulta",
  "FiscalizacaoOGE",
  "Recurso",
  "Outros"
];

const formulasExemplo = [
  { label: "0.5% do valor do contrato", value: "valor_contrato * 0.005" },
  { label: "1% do valor do contrato", value: "valor_contrato * 0.01" },
  { label: "2% do valor do contrato", value: "valor_contrato * 0.02" },
  { label: "Valor fixo", value: "valor_fixo" },
  { label: "Progressivo por escalão", value: "progressivo_escalao" },
];

export default function EmolumentosTabela({ onBack }: EmolumentosTabelaProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmolumento, setEditingEmolumento] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo_processo: "",
    formula: "",
    minimo: "",
    maximo_pct: ""
  });

  const queryClient = useQueryClient();

  const { data: emolumentos, isLoading } = useQuery({
    queryKey: ["emolumentos-tabela"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emolumentos_tabela")
        .select("*")
        .order("tipo_processo");
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("emolumentos_tabela")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emolumentos-tabela"] });
      toast.success("Emolumento criado com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar emolumento");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("emolumentos_tabela")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emolumentos-tabela"] });
      toast.success("Emolumento atualizado com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar emolumento");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("emolumentos_tabela")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emolumentos-tabela"] });
      toast.success("Emolumento excluído com sucesso");
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir emolumento");
    }
  });

  const resetForm = () => {
    setFormData({
      tipo_processo: "",
      formula: "",
      minimo: "",
      maximo_pct: ""
    });
    setEditingEmolumento(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (emolumento: any) => {
    setEditingEmolumento(emolumento);
    setFormData({
      tipo_processo: emolumento.tipo_processo,
      formula: emolumento.formula,
      minimo: emolumento.minimo?.toString() || "",
      maximo_pct: emolumento.maximo_pct?.toString() || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.tipo_processo || !formData.formula || !formData.minimo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const data = {
      tipo_processo: formData.tipo_processo,
      formula: formData.formula,
      minimo: parseFloat(formData.minimo),
      maximo_pct: formData.maximo_pct ? parseFloat(formData.maximo_pct) : null
    };

    if (editingEmolumento) {
      updateMutation.mutate({ id: editingEmolumento.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tabela de Emolumentos</h1>
            <p className="text-muted-foreground">Configurar valores e fórmulas de cálculo de emolumentos</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Emolumento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emolumentos Cadastrados</CardTitle>
          <CardDescription>Gerir fórmulas e valores de emolumentos por tipo de processo</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Processo</TableHead>
                  <TableHead>Fórmula</TableHead>
                  <TableHead>Valor Mínimo</TableHead>
                  <TableHead>Máximo (%)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emolumentos?.map((emolumento) => (
                  <TableRow key={emolumento.id}>
                    <TableCell className="font-medium">{emolumento.tipo_processo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        <code className="text-xs bg-muted px-2 py-1 rounded">{emolumento.formula}</code>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(emolumento.minimo)}
                    </TableCell>
                    <TableCell>
                      {emolumento.maximo_pct ? `${emolumento.maximo_pct}%` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(emolumento)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(emolumento.id)}>
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
          <CardTitle>Informações sobre Fórmulas</CardTitle>
          <CardDescription>Variáveis disponíveis para cálculo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">valor_contrato</code>
              <span className="text-sm text-muted-foreground">Valor do contrato/processo</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">valor_fixo</code>
              <span className="text-sm text-muted-foreground">Valor fixo definido no mínimo</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">progressivo_escalao</code>
              <span className="text-sm text-muted-foreground">Cálculo progressivo por escalões</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEmolumento ? "Editar Emolumento" : "Novo Emolumento"}</DialogTitle>
            <DialogDescription>
              Configure a fórmula de cálculo e valores para o tipo de processo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Processo *</Label>
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
              <Label>Fórmula de Cálculo *</Label>
              <div className="space-y-2">
                <Select value={formData.formula} onValueChange={(value) => setFormData({ ...formData, formula: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fórmula" />
                  </SelectTrigger>
                  <SelectContent>
                    {formulasExemplo.map((formula) => (
                      <SelectItem key={formula.value} value={formula.value}>
                        {formula.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={formData.formula}
                  onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  placeholder="Ou escreva uma fórmula personalizada..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Use variáveis como: valor_contrato, valor_fixo, progressivo_escalao
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Mínimo (AOA) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.minimo}
                  onChange={(e) => setFormData({ ...formData, minimo: e.target.value })}
                  placeholder="Ex: 10000.00"
                />
                <p className="text-xs text-muted-foreground">
                  Valor mínimo a ser cobrado
                </p>
              </div>

              <div className="space-y-2">
                <Label>Máximo Percentual (%) - Opcional</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.maximo_pct}
                  onChange={(e) => setFormData({ ...formData, maximo_pct: e.target.value })}
                  placeholder="Ex: 5.00"
                />
                <p className="text-xs text-muted-foreground">
                  Percentual máximo sobre o valor
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Exemplo de Cálculo:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Se valor do contrato = 1.000.000 AOA</p>
                <p>• Fórmula: valor_contrato * 0.01</p>
                <p>• Cálculo: 1.000.000 × 1% = 10.000 AOA</p>
                <p>• Mínimo: {formData.minimo ? formatCurrency(parseFloat(formData.minimo)) : "..."}</p>
                {formData.maximo_pct && (
                  <p>• Máximo: {formData.maximo_pct}% do valor</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingEmolumento ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este emolumento? Esta ação não pode ser desfeita e pode afetar o cálculo de processos futuros.
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
