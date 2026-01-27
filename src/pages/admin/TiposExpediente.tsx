import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface TiposExpedienteProps {
  onBack: () => void;
}

const tipoSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório").max(20, "Máximo 20 caracteres"),
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres"),
  descricao: z.string().optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  ativo: z.boolean().default(true),
});

type TipoForm = z.infer<typeof tipoSchema>;

interface TipoExpediente {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  ativo: boolean;
  criado_em: string;
}

const categorias = [
  { value: "correspondencia", label: "Correspondência" },
  { value: "comunicacao", label: "Comunicação" },
  { value: "solicitacao", label: "Solicitação" },
  { value: "documento", label: "Documento" },
  { value: "decisao", label: "Decisão" },
  { value: "processo", label: "Processo" },
  { value: "geral", label: "Geral" },
];

export default function TiposExpediente({ onBack }: TiposExpedienteProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoExpediente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState<TipoExpediente | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TipoForm>({
    resolver: zodResolver(tipoSchema),
    defaultValues: {
      codigo: "",
      nome: "",
      descricao: "",
      categoria: "geral",
      ativo: true,
    },
  });

  const ativo = watch("ativo");
  const categoria = watch("categoria");

  const { data: tipos, isLoading } = useQuery({
    queryKey: ["tipos-expediente"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tipos_expediente")
        .select("*")
        .order("codigo");
      
      if (error) throw error;
      return data as TipoExpediente[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TipoForm) => {
      const { error } = await supabase
        .from("tipos_expediente")
        .insert({
          codigo: data.codigo.toUpperCase(),
          nome: data.nome,
          descricao: data.descricao || null,
          categoria: data.categoria,
          ativo: data.ativo,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-expediente"] });
      toast({ title: "Tipo de expediente criado com sucesso" });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar tipo de expediente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TipoForm & { id: string }) => {
      const { error } = await supabase
        .from("tipos_expediente")
        .update({
          codigo: data.codigo.toUpperCase(),
          nome: data.nome,
          descricao: data.descricao || null,
          categoria: data.categoria,
          ativo: data.ativo,
        })
        .eq("id", data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-expediente"] });
      toast({ title: "Tipo de expediente actualizado com sucesso" });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao actualizar tipo de expediente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tipos_expediente")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipos-expediente"] });
      toast({ title: "Tipo de expediente eliminado com sucesso" });
      setDeleteDialogOpen(false);
      setTipoToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao eliminar tipo de expediente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenCreate = () => {
    setEditingTipo(null);
    reset({
      codigo: "",
      nome: "",
      descricao: "",
      categoria: "geral",
      ativo: true,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (tipo: TipoExpediente) => {
    setEditingTipo(tipo);
    reset({
      codigo: tipo.codigo,
      nome: tipo.nome,
      descricao: tipo.descricao || "",
      categoria: tipo.categoria,
      ativo: tipo.ativo,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTipo(null);
    reset();
  };

  const onSubmit = (data: TipoForm) => {
    if (editingTipo) {
      updateMutation.mutate({ ...data, id: editingTipo.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (tipo: TipoExpediente) => {
    setTipoToDelete(tipo);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tipoToDelete) {
      deleteMutation.mutate(tipoToDelete.id);
    }
  };

  const getCategoriaLabel = (value: string) => {
    return categorias.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Tipos de Expediente
          </h1>
          <p className="text-muted-foreground">Gerir tipos de expediente do sistema</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos</CardTitle>
          <CardDescription>Todos os tipos de expediente cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tipos?.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell className="font-mono font-semibold">{tipo.codigo}</TableCell>
                    <TableCell className="font-medium">{tipo.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoriaLabel(tipo.categoria)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {tipo.descricao || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tipo.ativo ? "default" : "secondary"}>
                        {tipo.ativo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(tipo)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tipo)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tipos?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhum tipo de expediente cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTipo ? "Editar Tipo de Expediente" : "Novo Tipo de Expediente"}
            </DialogTitle>
            <DialogDescription>
              {editingTipo
                ? "Actualize as informações do tipo de expediente"
                : "Preencha os dados para criar um novo tipo de expediente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  placeholder="Ex: OF"
                  {...register("codigo")}
                  className="uppercase"
                />
                {errors.codigo && (
                  <p className="text-sm text-destructive">{errors.codigo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={categoria} onValueChange={(value) => setValue("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && (
                  <p className="text-sm text-destructive">{errors.categoria.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Ex: Ofício"
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição do tipo de expediente..."
                {...register("descricao")}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Estado</Label>
                <p className="text-sm text-muted-foreground">
                  {ativo ? "Tipo activo e disponível" : "Tipo inactivo"}
                </p>
              </div>
              <Switch
                checked={ativo}
                onCheckedChange={(checked) => setValue("ativo", checked)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingTipo ? "Actualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Eliminação */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja eliminar o tipo de expediente "{tipoToDelete?.nome}"?
              Esta acção não pode ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
