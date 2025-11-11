import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProtectedAction } from "@/components/auth/ProtectedAction";
import { PermissionBadge } from "@/components/auth/PermissionBadge";
import { usePermissions } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";

interface ExemploPermissoesProps {
  onBack: () => void;
}

/**
 * Página de exemplo mostrando como usar o sistema de permissões
 */
export const ExemploPermissoes = ({ onBack }: ExemploPermissoesProps) => {
  return (
    <ProtectedRoute requiredPermission="processo.ver">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Exemplo de Permissões
              </h1>
              <p className="text-muted-foreground">
                Demonstração do sistema de controlo de acesso
              </p>
            </div>
          </div>
          <PermissionBadge />
        </div>

        <PermissionsInfo />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Acções Protegidas</h2>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <ProtectedAction requiredPermission="processo.criar">
                <Button>Criar Processo</Button>
              </ProtectedAction>

              <ProtectedAction requiredPermission="processo.editar">
                <Button variant="outline">Editar Processo</Button>
              </ProtectedAction>

              <ProtectedAction requiredPermission="processo.autuar">
                <Button variant="secondary">Autuar Processo</Button>
              </ProtectedAction>

              <ProtectedAction 
                requiredPermission="decisao.proferir"
                deniedMessage="Apenas Juízes podem proferir decisões"
              >
                <Button>Proferir Decisão</Button>
              </ProtectedAction>

              <ProtectedAction 
                requireAdmin
                hideWhenDenied
              >
                <Button variant="destructive">Eliminar (Admin)</Button>
              </ProtectedAction>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Os botões desabilitados indicam que não tem a permissão necessária.
                Passe o cursor por cima para ver a mensagem.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Conteúdo Protegido</h2>
          
          <ProtectedAction requiredPermission="processo.ver.todos">
            <div className="p-4 border border-border rounded-lg bg-accent/10">
              <h3 className="font-medium mb-2">Informação Sensível</h3>
              <p className="text-sm text-muted-foreground">
                Este conteúdo só é visível para utilizadores com a permissão
                "processo.ver.todos"
              </p>
            </div>
          </ProtectedAction>

          <ProtectedAction 
            requiredPermission="processo.ver.todos"
            hideWhenDenied
          >
            <div className="mt-4 p-4 border border-border rounded-lg bg-primary/10">
              <h3 className="font-medium mb-2">Conteúdo Oculto</h3>
              <p className="text-sm text-muted-foreground">
                Este conteúdo está completamente oculto se não tiver a permissão
                necessária (hideWhenDenied=true)
              </p>
            </div>
          </ProtectedAction>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

/**
 * Componente que mostra informações sobre as permissões do utilizador
 */
const PermissionsInfo = () => {
  const { permissoes, perfis, isAdmin } = usePermissions();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">As Suas Permissões</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Perfis Atribuídos
          </h3>
          {perfis.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum perfil atribuído</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {perfis.map((perfil) => (
                <Badge key={perfil.id} variant="outline">
                  {perfil.nome_perfil}
                  {perfil.area_funcional && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({perfil.area_funcional.nome_area})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Permissões Activas ({permissoes.length})
          </h3>
          {permissoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma permissão</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {permissoes.slice(0, 10).map((permissao) => (
                <Badge key={permissao} variant="secondary" className="text-xs">
                  {permissao}
                </Badge>
              ))}
              {permissoes.length > 10 && (
                <Badge variant="secondary" className="text-xs">
                  +{permissoes.length - 10} mais
                </Badge>
              )}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="p-4 border border-primary rounded-lg bg-primary/10">
            <p className="text-sm font-medium text-primary">
              ✓ Tem privilégios de Administrador (acesso total)
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
