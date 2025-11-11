import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CriarUtilizadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CriarUtilizadorDialog = ({ open, onOpenChange, onSuccess }: CriarUtilizadorDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome_completo: "",
    telefone: "",
    seccao: "",
    divisao: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Criar utilizador no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome_completo: formData.nome_completo,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Atualizar profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            nome_completo: formData.nome_completo,
            telefone: formData.telefone || null,
            seccao: formData.seccao || null,
            divisao: formData.divisao || null,
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Utilizador criado",
        description: "O utilizador foi criado com sucesso.",
      });

      setFormData({
        email: "",
        password: "",
        nome_completo: "",
        telefone: "",
        seccao: "",
        divisao: "",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao criar utilizador",
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
          <DialogTitle>Novo Utilizador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seccao">Secção</Label>
              <Input
                id="seccao"
                value={formData.seccao}
                onChange={(e) => setFormData({ ...formData, seccao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divisao">Divisão</Label>
              <Input
                id="divisao"
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
              Criar Utilizador
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
