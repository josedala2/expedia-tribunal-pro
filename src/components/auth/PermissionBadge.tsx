import { usePermissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente que mostra os perfis activos do utilizador
 */
export const PermissionBadge = () => {
  const { perfis, isAdmin, isLoading } = usePermissions();

  if (isLoading) {
    return <Skeleton className="h-6 w-24" />;
  }

  if (isAdmin) {
    return (
      <Badge variant="default" className="gap-1 bg-primary">
        <ShieldCheck className="h-3 w-3" />
        Administrador
      </Badge>
    );
  }

  if (perfis.length === 0) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Shield className="h-3 w-3" />
        Sem Perfil
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {perfis.map((perfil) => (
        <Badge key={perfil.id} variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          {perfil.nome_perfil}
        </Badge>
      ))}
    </div>
  );
};
