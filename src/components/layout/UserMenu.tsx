import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { LogOut, User, Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { perfis, isAdmin } = usePermissions();

  if (!user) return null;

  const iniciais = user.user_metadata?.nome_completo
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {iniciais}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.nome_completo || "Utilizador"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">Perfis Activos</p>
          <div className="flex flex-wrap gap-2">
            {isAdmin ? (
              <Badge variant="default" className="gap-1">
                <Shield className="h-3 w-3" />
                Administrador
              </Badge>
            ) : perfis.length > 0 ? (
              perfis.map((perfil) => (
                <Badge key={perfil.id} variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {perfil.nome_perfil}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Sem perfis atribuídos</p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Definições</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Terminar Sessão</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
