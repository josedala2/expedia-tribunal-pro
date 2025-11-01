import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, Filter, Users, Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface UsuariosManagementProps {
  onBack: () => void;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  tecnico_sg: "Técnico SG",
  chefe_cg: "Chefe CG",
  juiz_relator: "Juiz Relator",
  juiz_adjunto: "Juiz Adjunto",
  presidente_camara: "Presidente da Câmara",
  dst: "DST",
  secretaria: "Secretaria",
  ministerio_publico: "Ministério Público",
};

export const UsuariosManagement = ({ onBack }: UsuariosManagementProps) => {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAdmin()) {
      fetchUsuarios();
    }
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("nome_completo");

      if (profilesError) throw profilesError;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);

          return {
            ...profile,
            roles: roles?.map((r) => r.role) || [],
          };
        })
      );

      setUsuarios(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserRoles(user.roles || []);
    setIsDialogOpen(true);
  };

  const handleToggleRole = (role: string) => {
    setUserRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    try {
      // Delete all existing roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id);

      // Insert new roles
      if (userRoles.length > 0) {
        const rolesToInsert = userRoles.map((role) => ({
          user_id: selectedUser.id,
          role: role as "admin" | "tecnico_sg" | "chefe_cg" | "juiz_relator" | "juiz_adjunto" | "presidente_camara" | "dst" | "secretaria" | "ministerio_publico",
        }));

        const { error } = await supabase
          .from("user_roles")
          .insert(rolesToInsert);

        if (error) throw error;
      }

      toast.success("Perfis atualizados com sucesso");
      setIsDialogOpen(false);
      fetchUsuarios();
    } catch (error) {
      console.error("Error updating roles:", error);
      toast.error("Erro ao atualizar perfis");
    }
  };

  const filteredUsuarios = usuarios.filter((user) =>
    user.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-muted-foreground">Acesso não autorizado</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Gestão de Utilizadores
            </h1>
            <p className="text-muted-foreground">Administração de utilizadores e permissões do sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">{usuarios.length}</div>
          <div className="text-sm text-muted-foreground uppercase">Utilizadores Totais</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">
            {usuarios.filter((u) => u.roles.includes("admin")).length}
          </div>
          <div className="text-sm text-muted-foreground uppercase">Administradores</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">
            {usuarios.filter((u) => u.roles.includes("tecnico_sg")).length}
          </div>
          <div className="text-sm text-muted-foreground uppercase">Técnicos SG</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="text-2xl font-bold text-foreground">
            {usuarios.filter((u) => u.roles.includes("juiz_relator")).length}
          </div>
          <div className="text-sm text-muted-foreground uppercase">Juízes Relatores</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilizador</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Divisão/Secção</TableHead>
              <TableHead>Perfis</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {usuario.nome_completo?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{usuario.nome_completo}</span>
                  </div>
                </TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {usuario.divisao && <div>{usuario.divisao}</div>}
                    {usuario.seccao && <div className="text-muted-foreground">{usuario.seccao}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {usuario.roles.length > 0 ? (
                      usuario.roles.map((role: string) => (
                        <Badge key={role} variant="outline" className="gap-1 border-accent text-accent text-xs">
                          <Shield className="h-3 w-3" />
                          {roleLabels[role] || role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Sem perfil</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-accent border-accent hover:bg-accent/10"
                    onClick={() => handleEditUser(usuario)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Perfis do Utilizador</DialogTitle>
            <DialogDescription>
              {selectedUser?.nome_completo} - {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Selecione os perfis do utilizador:</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(roleLabels).map(([role, label]) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={userRoles.includes(role)}
                      onCheckedChange={() => handleToggleRole(role)}
                    />
                    <label
                      htmlFor={role}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRoles}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
