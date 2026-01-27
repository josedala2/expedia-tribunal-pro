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
        <Button variant="ghost" className="relative h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full touch-target">
          <Avatar className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] xs:text-xs sm:text-sm">
              {iniciais}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 xs:w-72 sm:w-80" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1 xs:space-y-2">
            <p className="text-xs xs:text-sm font-medium leading-none truncate">
              {user.user_metadata?.nome_completo || "Utilizador"}
            </p>
            <p className="text-[10px] xs:text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 xs:py-2">
          <p className="text-[10px] xs:text-xs font-medium text-muted-foreground mb-1.5 xs:mb-2">Perfis Activos</p>
          <div className="flex flex-wrap gap-1 xs:gap-2">
            {isAdmin ? (
              <Badge variant="default" className="gap-1 text-[10px] xs:text-xs">
                <Shield className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                Administrador
              </Badge>
            ) : perfis.length > 0 ? (
              perfis.map((perfil) => (
                <Badge key={perfil.id} variant="outline" className="gap-1 text-[10px] xs:text-xs">
                  <Shield className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                  {perfil.nome_perfil}
                </Badge>
              ))
            ) : (
              <p className="text-[10px] xs:text-xs text-muted-foreground">Sem perfis atribuídos</p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-xs xs:text-sm">
          <User className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-xs xs:text-sm">
          <Settings className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
          <span>Definições</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive text-xs xs:text-sm">
          <LogOut className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
          <span>Terminar Sessão</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
