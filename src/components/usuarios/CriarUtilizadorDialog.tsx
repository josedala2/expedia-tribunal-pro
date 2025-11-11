import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CriarUtilizadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CriarUtilizadorDialog = ({ open, onOpenChange, onSuccess }: CriarUtilizadorDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [openSeccao, setOpenSeccao] = useState(false);
  const [openDivisao, setOpenDivisao] = useState(false);
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
              <Popover open={openSeccao} onOpenChange={setOpenSeccao}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSeccao}
                    className="w-full justify-between"
                  >
                    {formData.seccao || "Selecione ou crie nova secção"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Pesquisar ou criar nova..." 
                      value={formData.seccao}
                      onValueChange={(value) => setFormData({ ...formData, seccao: value })}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2 text-sm text-muted-foreground">
                          Pressione Enter para criar "{formData.seccao}"
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {seccoes.map((seccao) => (
                          <CommandItem
                            key={seccao}
                            value={seccao}
                            onSelect={(currentValue) => {
                              setFormData({ ...formData, seccao: currentValue });
                              setOpenSeccao(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.seccao === seccao ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {seccao}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="divisao">Divisão</Label>
              <Popover open={openDivisao} onOpenChange={setOpenDivisao}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDivisao}
                    className="w-full justify-between"
                  >
                    {formData.divisao || "Selecione ou crie nova divisão"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Pesquisar ou criar nova..." 
                      value={formData.divisao}
                      onValueChange={(value) => setFormData({ ...formData, divisao: value })}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2 text-sm text-muted-foreground">
                          Pressione Enter para criar "{formData.divisao}"
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {divisoes.map((divisao) => (
                          <CommandItem
                            key={divisao}
                            value={divisao}
                            onSelect={(currentValue) => {
                              setFormData({ ...formData, divisao: currentValue });
                              setOpenDivisao(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.divisao === divisao ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {divisao}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
