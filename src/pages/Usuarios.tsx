import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, Filter, Users, Shield, Settings, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GestaoPerfisPerfis } from "./GestaoPerfisPerfis";
import { CriarUtilizadorDialog } from "@/components/usuarios/CriarUtilizadorDialog";
import { EditarUtilizadorDialog } from "@/components/usuarios/EditarUtilizadorDialog";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UsuariosProps {
  onBack: () => void;
}

interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string | null;
  seccao: string | null;
  divisao: string | null;
  roles: AppRole[];
}

export const Usuarios = ({ onBack }: UsuariosProps) => {
  const [showGestaoPerfis, setShowGestaoPerfis] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [criarDialogOpen, setCriarDialogOpen] = useState(false);
  const [editarDialogOpen, setEditarDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false,
    userId: "",
    userName: "",
  });
  const { toast } = useToast();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("nome_completo");

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = profilesData.map((profile) => ({
        ...profile,
        roles: rolesData?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [],
      }));

      setUsuarios(usersWithRoles);
      setFilteredUsuarios(usersWithRoles);
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
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(
      (user) =>
        user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  }, [searchTerm, usuarios]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(deleteDialog.userId);

      if (error) throw error;

      toast({
        title: "Utilizador eliminado",
        description: "O utilizador foi eliminado com sucesso.",
      });

      await fetchUsuarios();
      setDeleteDialog({ open: false, userId: "", userName: "" });
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar utilizador",
        description: error.message,
        variant: "destructive",
      });
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

  if (showGestaoPerfis) {
    return <GestaoPerfisPerfis onBack={() => setShowGestaoPerfis(false)} />;
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => setShowGestaoPerfis(true)}
          >
            <Settings className="h-5 w-5" />
            Perfis e Permissões
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
            onClick={() => setCriarDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Novo Utilizador
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">{usuarios.length}</div>
          <div className="text-sm text-muted-foreground uppercase">Utilizadores Total</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">
            {usuarios.filter(u => u.roles.includes("admin")).length}
          </div>
          <div className="text-sm text-muted-foreground uppercase">Administradores</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">
            {usuarios.filter(u => u.roles.includes("tecnico_sg")).length}
          </div>
          <div className="text-sm text-muted-foreground uppercase">Técnicos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="text-2xl font-bold text-foreground">
            {usuarios.filter(u => u.roles.includes("juiz_relator") || u.roles.includes("juiz_adjunto")).length}
          </div>
          <div className="text-sm text-muted-foreground uppercase">Juízes</div>
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

{loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">A carregar utilizadores...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Secção/Divisão</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {usuario.nome_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{usuario.nome_completo}</span>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.seccao || usuario.divisao || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {usuario.roles.length > 0 ? (
                        usuario.roles.map((role) => (
                          <Badge key={role} variant="outline" className="gap-1 border-accent text-accent">
                            <Shield className="h-3 w-3" />
                            {getRoleLabel(role)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Sem roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-accent border-accent hover:bg-accent/10"
                        onClick={() => {
                          setSelectedUserId(usuario.id);
                          setEditarDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteDialog({ 
                          open: true, 
                          userId: usuario.id, 
                          userName: usuario.nome_completo 
                        })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <CriarUtilizadorDialog
        open={criarDialogOpen}
        onOpenChange={setCriarDialogOpen}
        onSuccess={fetchUsuarios}
      />

      <EditarUtilizadorDialog
        open={editarDialogOpen}
        onOpenChange={setEditarDialogOpen}
        onSuccess={fetchUsuarios}
        userId={selectedUserId}
      />

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, userId: "", userName: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Utilizador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar o utilizador "{deleteDialog.userName}"? Esta ação não pode ser desfeita e todos os dados associados serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
