import { ArrowLeft, Plus, Search, Filter, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UsuariosProps {
  onBack: () => void;
}

export const Usuarios = ({ onBack }: UsuariosProps) => {
  const usuarios = [
    { nome: "João Silva", email: "joao.silva@tc.gov.ao", cargo: "Auditor Sénior", perfil: "Auditor", status: "Ativo" },
    { nome: "Maria Santos", email: "maria.santos@tc.gov.ao", cargo: "Técnica Superior", perfil: "Técnico", status: "Ativo" },
    { nome: "Carlos Neto", email: "carlos.neto@tc.gov.ao", cargo: "Diretor de Departamento", perfil: "Gestor", status: "Ativo" },
  ];

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
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2">
          <Plus className="h-5 w-5" />
          Novo Utilizador
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-success">
          <div className="text-2xl font-bold text-success">45</div>
          <div className="text-sm text-muted-foreground uppercase">Utilizadores Ativos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-sm text-muted-foreground uppercase">Auditores</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent">
          <div className="text-2xl font-bold text-accent">20</div>
          <div className="text-sm text-muted-foreground uppercase">Técnicos</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="text-2xl font-bold text-foreground">8</div>
          <div className="text-sm text-muted-foreground uppercase">Gestores</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por nome ou email..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilizador</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {usuario.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{usuario.nome}</span>
                  </div>
                </TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.cargo}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1 border-accent text-accent">
                    <Shield className="h-3 w-3" />
                    {usuario.perfil}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-success">
                    {usuario.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="text-accent border-accent hover:bg-accent/10">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
