import { ReactNode } from "react";
import { usePermissions, Permissao } from "@/hooks/usePermissions";
import { Card } from "@/components/ui/card";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Permissão ou permissões requeridas (pelo menos uma) */
  requiredPermission?: Permissao | Permissao[];
  /** Requer que o utilizador seja admin */
  requireAdmin?: boolean;
  /** Requer todas as permissões especificadas */
  requireAllPermissions?: Permissao[];
  /** Mensagem personalizada de acesso negado */
  deniedMessage?: string;
  /** Componente personalizado para acesso negado */
  fallback?: ReactNode;
  /** Redirecionar para página específica quando negado */
  redirectTo?: string;
}

/**
 * Componente para proteger rotas baseado em permissões
 * 
 * @example
 * // Requer uma permissão específica
 * <ProtectedRoute requiredPermission="processo.criar">
 *   <NovoProcessoPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Requer uma de várias permissões
 * <ProtectedRoute requiredPermission={["processo.editar", "processo.ver"]}>
 *   <ProcessoDetailPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Requer ser admin
 * <ProtectedRoute requireAdmin>
 *   <AdminPage />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requireAdmin = false,
  requireAllPermissions,
  deniedMessage,
  fallback,
  redirectTo,
}: ProtectedRouteProps) => {
  const { hasPermission, hasAllPermissions, isAdmin, isLoading } = usePermissions();

  // Mostrar loading enquanto verifica permissões
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">A verificar permissões...</p>
        </div>
      </div>
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

  // Se tiver acesso, mostrar conteúdo
  if (hasAccess) {
    return <>{children}</>;
  }

  // Redirecionar se especificado
  if (redirectTo) {
    window.location.href = redirectTo;
    return null;
  }

  // Mostrar fallback personalizado
  if (fallback) {
    return <>{fallback}</>;
  }

  // Mostrar mensagem padrão de acesso negado
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Acesso Negado</h2>
          <p className="text-muted-foreground">
            {deniedMessage ||
              "Não tem permissão para aceder a esta página. Contacte o administrador do sistema se acredita que isto é um erro."}
          </p>
        </div>

        <Button onClick={() => window.history.back()} variant="outline" className="w-full">
          Voltar
        </Button>
      </Card>
    </div>
  );
};
