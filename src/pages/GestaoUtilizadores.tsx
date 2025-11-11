import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, Search, UserPlus, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserProfile {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  seccao: string | null;
  divisao: string | null;
  created_at: string;
  roles: AppRole[];
}

export const GestaoUtilizadores = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string; role: AppRole }>({
    open: false,
    userId: "",
    role: "admin",
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Buscar profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("nome_completo");

      if (profilesError) throw profilesError;

      // Buscar roles de cada usuário
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combinar dados
      const usersWithRoles = profilesData.map((profile) => ({
        ...profile,
        roles: rolesData
          ?.filter((r) => r.user_id === profile.id)
          .map((r) => r.role) || [],
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar utilizadores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const addRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Role adicionada",
        description: "A role foi atribuída com sucesso.",
      });

      await fetchUsers();
      setSelectedUser(null);
      setSelectedRole("");
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast({
        title: "Role removida",
        description: "A role foi removida com sucesso.",
      });

      await fetchUsers();
      setDeleteDialog({ open: false, userId: "", role: "admin" });
    } catch (error: any) {
      toast({
        title: "Erro ao remover role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "juiz_relator":
      case "presidente_camara":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleLabel = (role: AppRole) => {
    const labels: Record<AppRole, string> = {
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
    return labels[role] || role;
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Gestão de Utilizadores
              </h1>
              <p className="text-muted-foreground">
                Gerir roles e permissões dos utilizadores
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">A carregar utilizadores...</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Secção/Divisão</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.nome_completo}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.seccao || user.divisao || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant={getRoleBadgeVariant(role)}
                                className="flex items-center gap-1"
                              >
                                {getRoleLabel(role)}
                                <button
                                  onClick={() =>
                                    setDeleteDialog({
                                      open: true,
                                      userId: user.id,
                                      role,
                                    })
                                  }
                                  className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Sem roles
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {selectedUser === user.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Select
                              value={selectedRole}
                              onValueChange={(value) => setSelectedRole(value as AppRole)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Selecionar role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  Administrador
                                </SelectItem>
                                <SelectItem value="tecnico_sg">
                                  Técnico SG
                                </SelectItem>
                                <SelectItem value="chefe_cg">
                                  Chefe CG
                                </SelectItem>
                                <SelectItem value="juiz_relator">
                                  Juiz Relator
                                </SelectItem>
                                <SelectItem value="juiz_adjunto">
                                  Juiz Adjunto
                                </SelectItem>
                                <SelectItem value="presidente_camara">
                                  Presidente Câmara
                                </SelectItem>
                                <SelectItem value="dst">DST</SelectItem>
                                <SelectItem value="secretaria">
                                  Secretaria
                                </SelectItem>
                                <SelectItem value="ministerio_publico">
                                  Ministério Público
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => selectedRole && addRole(user.id, selectedRole as AppRole)}
                              disabled={!selectedRole}
                            >
                              Adicionar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedUser(null);
                                setSelectedRole("");
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Adicionar Role
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            !open && setDeleteDialog({ open: false, userId: "", role: "admin" })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Role</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover a role "
                {getRoleLabel(deleteDialog.role)}" deste utilizador? Esta ação
                não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  removeRole(deleteDialog.userId, deleteDialog.role)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
};
