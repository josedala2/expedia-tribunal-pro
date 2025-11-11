import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EditarUtilizadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string | null;
}

export const EditarUtilizadorDialog = ({ open, onOpenChange, onSuccess, userId }: EditarUtilizadorDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    seccao: "",
    divisao: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (userId && open) {
      fetchUserData();
    }
  }, [userId, open]);

  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setFormData({
        nome_completo: data.nome_completo || "",
        email: data.email || "",
        telefone: data.telefone || "",
        seccao: data.seccao || "",
        divisao: data.divisao || "",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          nome_completo: formData.nome_completo,
          telefone: formData.telefone || null,
          seccao: formData.seccao || null,
          divisao: formData.divisao || null,
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Utilizador atualizado",
        description: "Os dados foram atualizados com sucesso.",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar utilizador",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Utilizador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_nome_completo">Nome Completo *</Label>
              <Input
                id="edit_nome_completo"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_telefone">Telefone</Label>
              <Input
                id="edit_telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_seccao">Secção</Label>
              <Input
                id="edit_seccao"
                value={formData.seccao}
                onChange={(e) => setFormData({ ...formData, seccao: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit_divisao">Divisão</Label>
              <Input
                id="edit_divisao"
                value={formData.divisao}
                onChange={(e) => setFormData({ ...formData, divisao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
