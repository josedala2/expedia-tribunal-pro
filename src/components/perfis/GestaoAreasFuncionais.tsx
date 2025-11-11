import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const GestaoAreasFuncionais = () => {
  const [editDialog, setEditDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome_area: "",
    descricao: "",
    unidades_internas: [] as string[],
  });
  const [newUnidade, setNewUnidade] = useState("");
  const queryClient = useQueryClient();

  const { data: areas, isLoading } = useQuery({
    queryKey: ["areas-funcionais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("areas_funcionais")
        .select("*")
        .order("nome_area");

      if (error) {
        toast.error("Erro ao carregar áreas funcionais");
        throw error;
      }

      return data;
    },
  });

  const updateAreaMutation = useMutation({
    mutationFn: async (data: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("areas_funcionais")
        .update(data.updates)
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas-funcionais"] });
      toast.success("Área funcional atualizada com sucesso");
      setEditDialog(false);
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar área funcional: " + error.message);
    },
  });

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setFormData({
      nome_area: area.nome_area || "",
      descricao: area.descricao || "",
      unidades_internas: area.unidades_internas || [],
    });
    setEditDialog(true);
  };

  const handleSave = () => {
    if (!selectedArea) return;

    updateAreaMutation.mutate({
      id: selectedArea.id,
      updates: formData,
    });
  };

  const addUnidade = () => {
    if (newUnidade.trim()) {
      setFormData({
        ...formData,
        unidades_internas: [...formData.unidades_internas, newUnidade.trim()],
      });
      setNewUnidade("");
    }
  };

  const removeUnidade = (index: number) => {
    setFormData({
      ...formData,
      unidades_internas: formData.unidades_internas.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">A carregar áreas funcionais...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas?.map((area) => (
          <Card key={area.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">{area.nome_area}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{area.descricao}</p>
                  </div>
                </div>
              </div>

              {area.unidades_internas && area.unidades_internas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Unidades Internas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.unidades_internas.map((unidade, index) => (
                      <Badge key={index} variant="outline">
                        {unidade}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleEdit(area)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Área Funcional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_area">Nome da Área *</Label>
              <Input
                id="nome_area"
                value={formData.nome_area}
                onChange={(e) => setFormData({ ...formData, nome_area: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Unidades Internas</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar unidade interna..."
                  value={newUnidade}
                  onChange={(e) => setNewUnidade(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addUnidade();
                    }
                  }}
                />
                <Button type="button" onClick={addUnidade} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.unidades_internas.map((unidade, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {unidade}
                    <button
                      type="button"
                      onClick={() => removeUnidade(index)}
                      className="hover:bg-background/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateAreaMutation.isPending}>
              Guardar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
