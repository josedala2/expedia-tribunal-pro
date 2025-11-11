import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AtribuirPerfilDialogProps {
  utilizador: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AtribuirPerfilDialog = ({
  utilizador,
  open,
  onOpenChange,
  onSuccess,
}: AtribuirPerfilDialogProps) => {
  const [perfisAtribuidos, setPerfisAtribuidos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: perfisDisponiveis } = useQuery({
    queryKey: ["perfis-disponiveis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfis_utilizador")
        .select("*")
        .eq("activo", true)
        .order("nome_perfil");

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (utilizador?.utilizador_perfis) {
      setPerfisAtribuidos(
        utilizador.utilizador_perfis.map((up: any) => up.perfil_id)
      );
    }
  }, [utilizador]);

  const handleAtribuirPerfil = async (perfilId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("utilizador_perfis").insert({
        user_id: utilizador.id,
        perfil_id: perfilId,
      });

      if (error) throw error;

      setPerfisAtribuidos([...perfisAtribuidos, perfilId]);
      toast.success("Perfil atribuído com sucesso");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao atribuir perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverPerfil = async (perfilId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("utilizador_perfis")
        .delete()
        .eq("user_id", utilizador.id)
        .eq("perfil_id", perfilId);

      if (error) throw error;

      setPerfisAtribuidos(perfisAtribuidos.filter((id) => id !== perfilId));
      toast.success("Perfil removido com sucesso");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao remover perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!utilizador) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerir Perfis - {utilizador.nome_completo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Perfis Atribuídos
            </h4>
            <div className="flex flex-wrap gap-2">
              {perfisAtribuidos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum perfil atribuído</p>
              ) : (
                perfisDisponiveis
                  ?.filter((p) => perfisAtribuidos.includes(p.id))
                  .map((perfil) => (
                    <Badge key={perfil.id} variant="default" className="gap-2">
                      {perfil.nome_perfil}
                      <button
                        onClick={() => handleRemoverPerfil(perfil.id)}
                        disabled={loading}
                        className="hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Perfis Disponíveis
            </h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-4">
                {perfisDisponiveis
                  ?.filter((p) => !perfisAtribuidos.includes(p.id))
                  .map((perfil) => (
                    <div
                      key={perfil.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{perfil.nome_perfil}</p>
                        <p className="text-sm text-muted-foreground">{perfil.descricao}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAtribuirPerfil(perfil.id)}
                        disabled={loading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Atribuir
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
