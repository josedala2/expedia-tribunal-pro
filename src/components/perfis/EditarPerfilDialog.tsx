import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditarPerfilDialogProps {
  perfil: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditarPerfilDialog = ({
  perfil,
  open,
  onOpenChange,
  onSuccess,
}: EditarPerfilDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [nomePerfil, setNomePerfil] = useState("");
  const [descricao, setDescricao] = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (perfil) {
      setNomePerfil(perfil.nome_perfil || "");
      setDescricao(perfil.descricao || "");
      setActivo(perfil.activo ?? true);
    }
  }, [perfil]);

  const handleSalvar = async () => {
    if (!perfil) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("perfis_utilizador")
        .update({
          nome_perfil: nomePerfil,
          descricao: descricao,
          activo: activo,
        })
        .eq("id", perfil.id);

      if (error) throw error;

      toast.success("Perfil actualizado com sucesso");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao actualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Perfil</Label>
            <Input
              id="nome"
              value={nomePerfil}
              onChange={(e) => setNomePerfil(e.target.value)}
              placeholder="Nome do perfil"
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do perfil"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="activo">Perfil Activo</Label>
            <Switch id="activo" checked={activo} onCheckedChange={setActivo} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={loading}>
            {loading ? "A guardar..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
