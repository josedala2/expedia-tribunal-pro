import { ReactNode } from "react";
import { usePermissions, Permissao } from "@/hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProtectedActionProps {
  children: ReactNode;
  /** Permissão ou permissões requeridas (pelo menos uma) */
  requiredPermission?: Permissao | Permissao[];
  /** Requer que o utilizador seja admin */
  requireAdmin?: boolean;
  /** Requer todas as permissões especificadas */
  requireAllPermissions?: Permissao[];
  /** Se true, esconde o elemento quando não tem permissão. Se false, desabilita */
  hideWhenDenied?: boolean;
  /** Mensagem de tooltip quando desabilitado */
  deniedMessage?: string;
  /** Componente alternativo quando não tem permissão */
  fallback?: ReactNode;
}

/**
 * Componente para proteger acções (botões, links, etc) baseado em permissões
 * Por padrão, desabilita o elemento quando não tem permissão
 * 
 * @example
 * // Desabilita botão se não tiver permissão
 * <ProtectedAction requiredPermission="processo.criar">
 *   <Button>Criar Processo</Button>
 * </ProtectedAction>
 * 
 * @example
 * // Esconde botão se não tiver permissão
 * <ProtectedAction requiredPermission="processo.eliminar" hideWhenDenied>
 *   <Button variant="destructive">Eliminar</Button>
 * </ProtectedAction>
 * 
 * @example
 * // Múltiplas permissões (precisa de pelo menos uma)
 * <ProtectedAction requiredPermission={["processo.editar", "processo.ver"]}>
 *   <Button>Ver Detalhes</Button>
 * </ProtectedAction>
 */
export const ProtectedAction = ({
  children,
  requiredPermission,
  requireAdmin = false,
  requireAllPermissions,
  hideWhenDenied = false,
  deniedMessage = "Não tem permissão para executar esta acção",
  fallback,
}: ProtectedActionProps) => {
  const { hasPermission, hasAllPermissions, isAdmin, isLoading } = usePermissions();

  // Enquanto carrega, mostrar elemento desabilitado
  if (isLoading) {
    if (hideWhenDenied) return null;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed opacity-50">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>A verificar permissões...</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Verificar se tem acesso
  let hasAccess = true;

  if (requireAdmin) {
    hasAccess = isAdmin;
  } else if (requireAllPermissions && requireAllPermissions.length > 0) {
    hasAccess = hasAllPermissions(requireAllPermissions);
  } else if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  }

  // Se tiver acesso, mostrar elemento normalmente
  if (hasAccess) {
    return <>{children}</>;
  }

  // Se não tiver acesso e deve esconder
  if (hideWhenDenied) {
    return fallback ? <>{fallback}</> : null;
  }

  // Se não tiver acesso, desabilitar elemento
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-not-allowed opacity-50 pointer-events-none">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{deniedMessage}</p>
      </TooltipContent>
    </Tooltip>
  );
};
