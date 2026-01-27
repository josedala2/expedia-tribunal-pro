import { usePermissions, Permissao } from "./usePermissions";
import { 
  grupoPermissoes, 
  itemPermissoes, 
  adminOnlyGroups, 
  adminOnlyItems,
  perfilMenuAccess 
} from "@/config/menuPermissions";

/**
 * Hook para verificar se o utilizador tem acesso a grupos e itens de menu
 */
export const useMenuAccess = () => {
  const { permissoes, perfis, isAdmin, isLoading, userId } = usePermissions();

  /**
   * Verifica se o utilizador tem pelo menos uma das permissões
   */
  const hasAnyPermission = (requiredPermissions: Permissao[]): boolean => {
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.some(p => permissoes.includes(p));
  };

  /**
   * Verifica se o utilizador tem um dos perfis especificados
   */
  const hasAnyPerfil = (requiredPerfis: string[]): boolean => {
    if (requiredPerfis.length === 0) return false;
    return perfis.some(p => requiredPerfis.includes(p.nome_perfil));
  };

  /**
   * Verifica se o utilizador pode ver um grupo de menu
   */
  const canAccessGroup = (groupId: string): boolean => {
    // Se estiver a carregar, não mostrar nada ainda
    if (isLoading || !userId) return false;

    // Admins têm acesso total
    if (isAdmin) return true;

    // Verificar se é grupo apenas para admins
    if (adminOnlyGroups.includes(groupId)) {
      return false;
    }

    // Verificar permissões do grupo
    const requiredPermissions = grupoPermissoes[groupId] || [];
    
    // Se não há permissões requeridas, grupo é visível para todos autenticados
    if (requiredPermissions.length === 0) return true;

    return hasAnyPermission(requiredPermissions);
  };

  /**
   * Verifica se o utilizador pode ver um item de menu
   */
  const canAccessItem = (itemId: string): boolean => {
    // Se estiver a carregar, não mostrar nada ainda
    if (isLoading || !userId) return false;

    // Admins têm acesso total
    if (isAdmin) return true;

    // Verificar se é item apenas para admins
    if (adminOnlyItems.includes(itemId)) {
      return false;
    }

    // Verificar acesso por perfil específico
    const perfilAccess = perfilMenuAccess[itemId];
    if (perfilAccess && perfilAccess.length > 0) {
      if (hasAnyPerfil(perfilAccess)) return true;
    }

    // Verificar permissões do item
    const requiredPermissions = itemPermissoes[itemId] || [];
    
    // Se não há permissões requeridas, item é visível para todos autenticados
    if (requiredPermissions.length === 0) return true;

    return hasAnyPermission(requiredPermissions);
  };

  /**
   * Filtra itens de submenu com base nas permissões
   */
  const filterSubmenuItems = (items: Array<{ id: string; label: string }>): Array<{ id: string; label: string }> => {
    return items.filter(item => canAccessItem(item.id));
  };

  return {
    canAccessGroup,
    canAccessItem,
    filterSubmenuItems,
    isLoading,
    isAdmin,
    userId,
  };
};
