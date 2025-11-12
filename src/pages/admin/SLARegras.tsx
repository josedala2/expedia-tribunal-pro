import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2, Clock, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
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

interface SLARegrasProps {
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

const urgencias = [
  { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800" },
  { value: "simplificado_urgencia", label: "Simplificado Urgência", color: "bg-yellow-100 text-yellow-800" },
  { value: "urgente", label: "Urgente", color: "bg-red-100 text-red-800" }
];

// Schema de validação
const slaSchema = z.object({
  tipo_processo: z.string().trim().min(1, "Tipo de processo é obrigatório").max(100),
  urgencia: z.enum(["normal", "simplificado_urgencia", "urgente"], {
    errorMap: () => ({ message: "Urgência inválida" })
  }),
  prazo_dias: z.number().int().positive("Prazo deve ser positivo").max(365, "Prazo máximo é 365 dias"),
  suspende_por_solicitacao: z.boolean()
});

type SLAFormData = z.infer<typeof slaSchema>;

export default function SLARegras({ onBack }: SLARegrasProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSLA, setEditingSLA] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SLAFormData>({
    tipo_processo: "",
    urgencia: "normal",
    prazo_dias: 30,
    suspende_por_solicitacao: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const { data: slas, isLoading } = useQuery({
    queryKey: ["sla-regras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sla_regras")
        .select("*")
        .order("tipo_processo");
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: SLAFormData) => {
      const insertData = {
        tipo_processo: data.tipo_processo,
        urgencia: data.urgencia,
        prazo_dias: data.prazo_dias,
        suspende_por_solicitacao: data.suspende_por_solicitacao
      };
      
      const { error } = await supabase
        .from("sla_regras")
        .insert([insertData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sla-regras"] });
      toast.success("Regra de SLA criada com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar regra de SLA");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SLAFormData }) => {
      const updateData = {
        tipo_processo: data.tipo_processo,
        urgencia: data.urgencia,
        prazo_dias: data.prazo_dias,
        suspende_por_solicitacao: data.suspende_por_solicitacao
      };
      
      const { error } = await supabase
        .from("sla_regras")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sla-regras"] });
      toast.success("Regra de SLA atualizada com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar regra de SLA");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sla_regras")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sla-regras"] });
      toast.success("Regra de SLA excluída com sucesso");
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir regra de SLA");
    }
  });

  const resetForm = () => {
    setFormData({
      tipo_processo: "",
      urgencia: "normal",
      prazo_dias: 30,
      suspende_por_solicitacao: true
    });
    setErrors({});
    setEditingSLA(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (sla: any) => {
    setEditingSLA(sla);
    setFormData({
      tipo_processo: sla.tipo_processo,
      urgencia: sla.urgencia,
      prazo_dias: sla.prazo_dias,
      suspende_por_solicitacao: sla.suspende_por_solicitacao
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    try {
      slaSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Corrija os erros no formulário");
      return;
    }

    if (editingSLA) {
      updateMutation.mutate({ id: editingSLA.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getUrgenciaInfo = (urgencia: string) => {
    return urgencias.find(u => u.value === urgencia) || urgencias[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Regras de SLA</h1>
            <p className="text-muted-foreground">Definir prazos e políticas de suspensão por tipo de processo</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Regra SLA
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regras Cadastradas</CardTitle>
          <CardDescription>Gerir prazos e urgências dos processos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Processo</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Suspensão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slas?.map((sla) => {
                  const urgenciaInfo = getUrgenciaInfo(sla.urgencia);
                  return (
                    <TableRow key={sla.id}>
                      <TableCell className="font-medium">{sla.tipo_processo}</TableCell>
                      <TableCell>
                        <Badge className={urgenciaInfo.color}>
                          {urgenciaInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{sla.prazo_dias} dias</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sla.suspende_por_solicitacao ? (
                          <Badge variant="outline" className="bg-green-50">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Suspende
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Não Suspende
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(sla)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sla.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações sobre SLA</CardTitle>
          <CardDescription>Como funcionam os prazos e suspensões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Prazos de Atendimento</p>
                <p className="text-sm text-muted-foreground">
                  Definem o tempo máximo para conclusão de cada tipo de processo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium">Níveis de Urgência</p>
                <p className="text-sm text-muted-foreground">
                  Normal (padrão), Simplificado Urgência (prioridade média), Urgente (máxima prioridade)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="h-5 w-5 rounded-full mt-0.5" />
              <div>
                <p className="font-medium">Suspensão Automática</p>
                <p className="text-sm text-muted-foreground">
                  Quando ativada, o prazo é suspenso automaticamente ao aguardar resposta de solicitação externa
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSLA ? "Editar Regra de SLA" : "Nova Regra de SLA"}</DialogTitle>
            <DialogDescription>
              Configure os prazos e políticas de atendimento para o tipo de processo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Processo *</Label>
              <Select 
                value={formData.tipo_processo} 
                onValueChange={(value) => setFormData({ ...formData, tipo_processo: value })}
              >
                <SelectTrigger className={errors.tipo_processo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposProcesso.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo_processo && (
                <p className="text-sm text-red-500">{errors.tipo_processo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nível de Urgência *</Label>
              <Select 
                value={formData.urgencia} 
                onValueChange={(value) => setFormData({ ...formData, urgencia: value as any })}
              >
                <SelectTrigger className={errors.urgencia ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a urgência" />
                </SelectTrigger>
                <SelectContent>
                  {urgencias.map((urgencia) => (
                    <SelectItem key={urgencia.value} value={urgencia.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${urgencia.color}`} />
                        {urgencia.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.urgencia && (
                <p className="text-sm text-red-500">{errors.urgencia}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Define a prioridade do processo no sistema
              </p>
            </div>

            <div className="space-y-2">
              <Label>Prazo em Dias *</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={formData.prazo_dias}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, prazo_dias: value });
                }}
                placeholder="Ex: 30"
                className={errors.prazo_dias ? "border-red-500" : ""}
              />
              {errors.prazo_dias && (
                <p className="text-sm text-red-500">{errors.prazo_dias}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Número de dias úteis para conclusão do processo (máximo 365)
              </p>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
              <Switch
                checked={formData.suspende_por_solicitacao}
                onCheckedChange={(checked) => setFormData({ ...formData, suspende_por_solicitacao: checked })}
              />
              <div className="space-y-1">
                <Label className="cursor-pointer">Suspender por Solicitação Externa</Label>
                <p className="text-xs text-muted-foreground">
                  Quando ativado, o prazo SLA será automaticamente suspenso ao aguardar resposta de solicitações externas (ofícios, diligências, etc.)
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Resumo da Configuração:</p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Tipo: <strong>{formData.tipo_processo || "..."}</strong></p>
                <p>• Urgência: <strong>{getUrgenciaInfo(formData.urgencia).label}</strong></p>
                <p>• Prazo: <strong>{formData.prazo_dias} dias úteis</strong></p>
                <p>• Suspensão: <strong>{formData.suspende_por_solicitacao ? "Sim" : "Não"}</strong></p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingSLA ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta regra de SLA? Esta ação não pode ser desfeita e pode afetar o controle de prazos dos processos.
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
