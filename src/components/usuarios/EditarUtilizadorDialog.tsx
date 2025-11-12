import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, Plus, X, User, Cog, Link2, Check, ChevronsUpDown, KeyRound } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleWithType {
  role: AppRole;
  tipo_atribuicao: 'manual' | 'automatico' | 'herdado';
  origem_atribuicao: string | null;
}

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
  const [currentRoles, setCurrentRoles] = useState<RoleWithType[]>([]);
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");
  const [addingRole, setAddingRole] = useState(false);
  const [openSeccao, setOpenSeccao] = useState(false);
  const [openDivisao, setOpenDivisao] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const { toast } = useToast();

  const { data: profiles } = useQuery({
    queryKey: ["profiles-seccao-divisao"],
    queryFn: async () => {
      // Fetch from organizacao_estrutura
      const { data: estruturaSeccoes } = await supabase
        .from("organizacao_estrutura")
        .select("nome")
        .eq("tipo", "seccao");
      
      const { data: estruturaDivisoes } = await supabase
        .from("organizacao_estrutura")
        .select("nome")
        .eq("tipo", "divisao");
      
      // Fetch from profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("seccao, divisao");
      
      if (error) throw error;
      
      return {
        seccoes: [...new Set([
          ...(estruturaSeccoes?.map(e => e.nome) || []),
          ...(data?.map(p => p.seccao).filter(Boolean) || [])
        ])],
        divisoes: [...new Set([
          ...(estruturaDivisoes?.map(e => e.nome) || []),
          ...(data?.map(p => p.divisao).filter(Boolean) || [])
        ])]
      };
    },
  });

  const seccoes = profiles?.seccoes?.sort() || [];
  const divisoes = profiles?.divisoes?.sort() || [];

  const getRoleIcon = (tipo: 'manual' | 'automatico' | 'herdado') => {
    switch (tipo) {
      case 'manual':
        return <User className="h-3 w-3" />;
      case 'automatico':
        return <Cog className="h-3 w-3" />;
      case 'herdado':
        return <Link2 className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = (tipo: 'manual' | 'automatico' | 'herdado') => {
    switch (tipo) {
      case 'manual':
        return "default";
      case 'automatico':
        return "secondary";
      case 'herdado':
        return "outline";
    }
  };

  const getRoleTypeLabel = (tipo: 'manual' | 'automatico' | 'herdado') => {
    switch (tipo) {
      case 'manual':
        return "Atribuída manualmente";
      case 'automatico':
        return "Atribuída automaticamente";
      case 'herdado':
        return "Herdada";
    }
  };

  const roleLabels: Record<AppRole, string> = {
    admin: "Administrador",
    tecnico_sg: "Técnico SG",
    chefe_cg: "Chefe CG",
    juiz_relator: "Juiz Relator",
    juiz_adjunto: "Juiz Adjunto",
    presidente_camara: "Presidente Câmara",
    dst: "DST",
    secretaria: "Secretaria",
    ministerio_publico: "Ministério Público",
  };

  const allRoles: AppRole[] = [
    "admin",
    "tecnico_sg",
    "chefe_cg",
    "juiz_relator",
    "juiz_adjunto",
    "presidente_camara",
    "dst",
    "secretaria",
    "ministerio_publico",
  ];

  const availableRoles = allRoles.filter(role => !currentRoles.find(r => r.role === role));

  useEffect(() => {
    if (userId && open) {
      fetchUserData();
    }
  }, [userId, open]);

  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setFormData({
          nome_completo: profileData.nome_completo || "",
          email: profileData.email || "",
          telefone: profileData.telefone || "",
          seccao: profileData.seccao || "",
          divisao: profileData.divisao || "",
        });
      }

      // Buscar roles com tipo de atribuição
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role, tipo_atribuicao, origem_atribuicao")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      setCurrentRoles(rolesData?.map(r => ({
        role: r.role,
        tipo_atribuicao: (r.tipo_atribuicao || 'manual') as 'manual' | 'automatico' | 'herdado',
        origem_atribuicao: r.origem_atribuicao,
      })) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addRole = async () => {
    if (!userId || !selectedRole) return;

    setAddingRole(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ 
          user_id: userId, 
          role: selectedRole,
          tipo_atribuicao: 'manual',
          origem_atribuicao: null,
        });

      if (error) throw error;

      toast({
        title: "Role adicionada",
        description: `A role ${roleLabels[selectedRole]} foi atribuída com sucesso.`,
      });

      setCurrentRoles([...currentRoles, {
        role: selectedRole,
        tipo_atribuicao: 'manual',
        origem_atribuicao: null,
      }]);
      setSelectedRole("");
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddingRole(false);
    }
  };

  const removeRole = async (role: AppRole, tipo: 'manual' | 'automatico' | 'herdado') => {
    if (!userId) return;

    // Não permitir remover roles automáticas ou herdadas
    if (tipo !== 'manual') {
      toast({
        title: "Ação não permitida",
        description: `Não é possível remover roles ${tipo === 'automatico' ? 'automáticas' : 'herdadas'}. Contacte o administrador do sistema.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast({
        title: "Role removida",
        description: `A role ${roleLabels[role]} foi removida com sucesso.`,
      });

      setCurrentRoles(currentRoles.filter(r => r.role !== role));
    } catch (error: any) {
      toast({
        title: "Erro ao remover role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (!userId) return;

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha ambos os campos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error } = await supabase.functions.invoke("update-user-password", {
        body: {
          userId,
          newPassword,
        },
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada",
        description: "A senha foi alterada com sucesso.",
      });

      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar a senha.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPassword(false);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Utilizador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Informações Pessoais</h3>
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
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Pesquisar ou criar secção..." 
                        onValueChange={(value) => setFormData({ ...formData, seccao: value })}
                      />
                      <CommandEmpty>
                        <div className="p-2 text-sm">
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
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit_divisao">Divisão</Label>
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
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Pesquisar ou criar divisão..." 
                        onValueChange={(value) => setFormData({ ...formData, divisao: value })}
                      />
                      <CommandEmpty>
                        <div className="p-2 text-sm">
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
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Gestão de Roles
              </h3>
            </div>

            <div className="space-y-3">
              <Label>Roles Atribuídas</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/30">
                {currentRoles.length > 0 ? (
                  <TooltipProvider>
                    {currentRoles.map((roleData) => (
                      <Tooltip key={roleData.role}>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={getRoleBadgeVariant(roleData.tipo_atribuicao)}
                            className="gap-2"
                          >
                            {getRoleIcon(roleData.tipo_atribuicao)}
                            {roleLabels[roleData.role]}
                            {roleData.tipo_atribuicao === 'manual' && (
                              <button
                                type="button"
                                onClick={() => removeRole(roleData.role, roleData.tipo_atribuicao)}
                                className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">{getRoleTypeLabel(roleData.tipo_atribuicao)}</p>
                            {roleData.origem_atribuicao && (
                              <p className="text-xs text-muted-foreground">
                                Origem: {roleData.origem_atribuicao}
                              </p>
                            )}
                            {roleData.tipo_atribuicao !== 'manual' && (
                              <p className="text-xs text-muted-foreground italic">
                                Não pode ser removida manualmente
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhuma role atribuída
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Manual</span>
                </div>
                <div className="flex items-center gap-1">
                  <Cog className="h-3 w-3" />
                  <span>Automática</span>
                </div>
                <div className="flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  <span>Herdada</span>
                </div>
              </div>
            </div>

            {availableRoles.length > 0 && (
              <div className="space-y-3">
                <Label>Adicionar Role</Label>
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecionar role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {roleLabels[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={addRole}
                    disabled={!selectedRole || addingRole}
                    className="gap-2"
                  >
                    {addingRole ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Gestão de Senha
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">Nova Senha</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmar Senha</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleUpdatePassword}
              disabled={updatingPassword || !newPassword || !confirmPassword}
              variant="secondary"
              className="w-full"
            >
              {updatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <KeyRound className="mr-2 h-4 w-4" />
              Alterar Senha
            </Button>
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
