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

interface MapaLetraJuizProps {
  onBack: () => void;
}

export default function MapaLetraJuiz({ onBack }: MapaLetraJuizProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMapa, setEditingMapa] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    letra: "",
    juiz_relator_perfil_id: "",
    juiz_adjunto_perfil_id: "",
    vigencia: "{}"
  });

  const queryClient = useQueryClient();

  const { data: mapas, isLoading } = useQuery({
    queryKey: ["mapa-letra-juiz"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mapa_letra_juiz")
        .select("*, juiz_relator:perfis_utilizador!juiz_relator_perfil_id(nome_perfil), juiz_adjunto:perfis_utilizador!juiz_adjunto_perfil_id(nome_perfil)")
        .order("letra");
      
      if (error) throw error;
      return data;
    }
  });

  const { data: perfis } = useQuery({
    queryKey: ["perfis-utilizador"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis_utilizador")
        .select("id, nome_perfil")
        .eq("activo", true)
        .order("nome_perfil");
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("mapa_letra_juiz")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mapa-letra-juiz"] });
      toast.success("Mapa criado com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar mapa");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("mapa_letra_juiz")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mapa-letra-juiz"] });
      toast.success("Mapa atualizado com sucesso");
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar mapa");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("mapa_letra_juiz")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mapa-letra-juiz"] });
      toast.success("Mapa excluído com sucesso");
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir mapa");
    }
  });

  const resetForm = () => {
    setFormData({
      letra: "",
      juiz_relator_perfil_id: "",
      juiz_adjunto_perfil_id: "",
      vigencia: "{}"
    });
    setEditingMapa(null);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (mapa: any) => {
    setEditingMapa(mapa);
    setFormData({
      letra: mapa.letra,
      juiz_relator_perfil_id: mapa.juiz_relator_perfil_id || "",
      juiz_adjunto_perfil_id: mapa.juiz_adjunto_perfil_id || "",
      vigencia: JSON.stringify(mapa.vigencia || {}, null, 2)
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.letra.trim()) {
      toast.error("Letra é obrigatória");
      return;
    }

    let vigencia;
    try {
      vigencia = JSON.parse(formData.vigencia);
    } catch (e) {
      toast.error("Vigência JSON inválida");
      return;
    }

    const data = {
      letra: formData.letra,
      juiz_relator_perfil_id: formData.juiz_relator_perfil_id || null,
      juiz_adjunto_perfil_id: formData.juiz_adjunto_perfil_id || null,
      vigencia
    };

    if (editingMapa) {
      updateMutation.mutate({ id: editingMapa.id, data });
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
            <h1 className="text-3xl font-bold">Mapa Letra de Juiz</h1>
            <p className="text-muted-foreground">Atribuição de letras aos juízes relatores e adjuntos</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Atribuição
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapa de Letras</CardTitle>
          <CardDescription>Gerir atribuições de letras aos juízes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Letra</TableHead>
                  <TableHead>Juiz Relator</TableHead>
                  <TableHead>Juiz Adjunto</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mapas?.map((mapa) => (
                  <TableRow key={mapa.id}>
                    <TableCell className="font-bold text-lg">{mapa.letra}</TableCell>
                    <TableCell>{mapa.juiz_relator?.nome_perfil || "-"}</TableCell>
                    <TableCell>{mapa.juiz_adjunto?.nome_perfil || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(mapa)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(mapa.id)}>
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
            <DialogTitle>{editingMapa ? "Editar Atribuição" : "Nova Atribuição"}</DialogTitle>
            <DialogDescription>
              Configure a letra e os juízes responsáveis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Letra</Label>
              <Input
                value={formData.letra}
                onChange={(e) => setFormData({ ...formData, letra: e.target.value.toUpperCase() })}
                placeholder="Ex: A, B, C..."
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Juiz Relator</Label>
              <Select value={formData.juiz_relator_perfil_id} onValueChange={(value) => setFormData({ ...formData, juiz_relator_perfil_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o juiz relator" />
                </SelectTrigger>
                <SelectContent>
                  {perfis?.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id}>{perfil.nome_perfil}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Juiz Adjunto (Opcional)</Label>
              <Select value={formData.juiz_adjunto_perfil_id} onValueChange={(value) => setFormData({ ...formData, juiz_adjunto_perfil_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o juiz adjunto" />
                </SelectTrigger>
                <SelectContent>
                  {perfis?.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id}>{perfil.nome_perfil}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vigência (JSON)</Label>
              <Textarea
                value={formData.vigencia}
                onChange={(e) => setFormData({ ...formData, vigencia: e.target.value })}
                rows={4}
                placeholder='{"inicio": "2025-01-01", "fim": "2025-12-31"}'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingMapa ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta atribuição? Esta ação não pode ser desfeita.
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
