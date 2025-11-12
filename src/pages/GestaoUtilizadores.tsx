import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Shield, Search, UserPlus, Trash2, Building2, Users } from "lucide-react";
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
import { GestaoSeccoesDivisoes } from "@/components/usuarios/GestaoSeccoesDivisoes";
import { EditarUtilizadorDialog } from "@/components/usuarios/EditarUtilizadorDialog";
import { CriarUtilizadorDialog } from "@/components/usuarios/CriarUtilizadorDialog";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleWithType {
  role: AppRole;
  tipo_atribuicao: 'manual' | 'automatico' | 'herdado';
  origem_atribuicao: string | null;
}

interface UserProfile {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  seccao: string | null;
  divisao: string | null;
  created_at: string;
  roles: RoleWithType[];
}

export const GestaoUtilizadores = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string }>({
    open: false,
    userId: "",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
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

      // Buscar roles de cada usuário com tipo de atribuição
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, tipo_atribuicao, origem_atribuicao");

      if (rolesError) throw rolesError;

      // Combinar dados
      const usersWithRoles = profilesData.map((profile) => ({
        ...profile,
        roles: rolesData
          ?.filter((r) => r.user_id === profile.id)
          .map((r) => ({
            role: r.role,
            tipo_atribuicao: (r.tipo_atribuicao || 'manual') as 'manual' | 'automatico' | 'herdado',
            origem_atribuicao: r.origem_atribuicao,
          })) || [],
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

  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast({
        title: "Utilizador eliminado",
        description: "O utilizador foi eliminado com sucesso.",
      });

      await fetchUsers();
      setDeleteDialog({ open: false, userId: "" });
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar utilizador",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setEditDialogOpen(true);
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
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Gestão de Utilizadores
              </h1>
              <p className="text-muted-foreground">
                Gerir utilizadores, roles e organização
              </p>
            </div>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Utilizador
          </Button>
        </div>

        <Tabs defaultValue="utilizadores" className="space-y-6">
          <TabsList>
            <TabsTrigger value="utilizadores" className="gap-2">
              <Users className="h-4 w-4" />
              Utilizadores
            </TabsTrigger>
            <TabsTrigger value="organizacao" className="gap-2">
              <Building2 className="h-4 w-4" />
              Organização
            </TabsTrigger>
          </TabsList>

          <TabsContent value="utilizadores">
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
                            <div className="flex flex-col gap-1">
                              {user.seccao && (
                                <span className="text-sm">Secção: {user.seccao}</span>
                              )}
                              {user.divisao && (
                                <span className="text-sm text-muted-foreground">
                                  Divisão: {user.divisao}
                                </span>
                              )}
                              {!user.seccao && !user.divisao && "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {user.roles.length > 0 ? (
                                user.roles.map((roleData) => (
                                  <Badge
                                    key={roleData.role}
                                    variant={getRoleBadgeVariant(roleData.tipo_atribuicao)}
                                  >
                                    {getRoleLabel(roleData.role)}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  Sem roles
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(user.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  userId: user.id,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="organizacao">
            <GestaoSeccoesDivisoes />
          </TabsContent>
        </Tabs>

        <EditarUtilizadorDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={fetchUsers}
          userId={selectedUserId}
        />

        <CriarUtilizadorDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={fetchUsers}
        />

        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            !open && setDeleteDialog({ open: false, userId: "" })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar Utilizador</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja eliminar este utilizador? Esta ação
                não pode ser desfeita e irá remover todos os dados associados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(deleteDialog.userId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
};
