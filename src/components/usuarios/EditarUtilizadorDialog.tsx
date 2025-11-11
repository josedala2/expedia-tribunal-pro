import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, Plus, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

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
  const [currentRoles, setCurrentRoles] = useState<AppRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");
  const [addingRole, setAddingRole] = useState(false);
  const { toast } = useToast();

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

  const availableRoles = allRoles.filter(role => !currentRoles.includes(role));

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

      // Buscar roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      setCurrentRoles(rolesData?.map(r => r.role) || []);
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
        .insert({ user_id: userId, role: selectedRole });

      if (error) throw error;

      toast({
        title: "Role adicionada",
        description: `A role ${roleLabels[selectedRole]} foi atribuída com sucesso.`,
      });

      setCurrentRoles([...currentRoles, selectedRole]);
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

  const removeRole = async (role: AppRole) => {
    if (!userId) return;

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

      setCurrentRoles(currentRoles.filter(r => r !== role));
    } catch (error: any) {
      toast({
        title: "Erro ao remover role",
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
                  currentRoles.map((role) => (
                    <Badge
                      key={role}
                      variant="default"
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      <Shield className="h-3 w-3" />
                      {roleLabels[role]}
                      <button
                        type="button"
                        onClick={() => removeRole(role)}
                        className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhuma role atribuída
                  </span>
                )}
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
