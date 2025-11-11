import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch existing secções and divisões
  const { data: profiles } = useQuery({
    queryKey: ["profiles-seccao-divisao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("seccao, divisao");
      
      if (error) throw error;
      return data;
    },
  });

  // Extract unique secções and divisões
  const seccoes = [...new Set(profiles?.map(p => p.seccao).filter(Boolean))].sort();
  const divisoes = [...new Set(profiles?.map(p => p.divisao).filter(Boolean))].sort();

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
              <Select
                value={formData.seccao}
                onValueChange={(value) => setFormData({ ...formData, seccao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a secção" />
                </SelectTrigger>
                <SelectContent>
                  {seccoes.map((seccao) => (
                    <SelectItem key={seccao} value={seccao}>
                      {seccao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="divisao">Divisão</Label>
              <Select
                value={formData.divisao}
                onValueChange={(value) => setFormData({ ...formData, divisao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a divisão" />
                </SelectTrigger>
                <SelectContent>
                  {divisoes.map((divisao) => (
                    <SelectItem key={divisao} value={divisao}>
                      {divisao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
