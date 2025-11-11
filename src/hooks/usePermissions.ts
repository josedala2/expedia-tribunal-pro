import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export type Permissao =
  | "processo.criar"
  | "processo.ver"
  | "processo.editar"
  | "processo.autuar"
  | "processo.distribuir"
  | "processo.ver.todos"
  | "processo.submeter.juiz"
  | "expediente.validar"
  | "expediente.aprovar"
  | "expediente.devolver"
  | "documento.anexar"
  | "relatorio.criar"
  | "relatorio.editar"
  | "relatorio.validar"
  | "cq.executar"
  | "oficio.emitir"
  | "decisao.proferir"
  | "decisao.coadjuvar"
  | "prazo.suspender"
  | "vista.mp.abrir"
  | "promocao.emitir"
  | "notificacao.executar"
  | "certidao.emitir";

export interface UserPermissions {
  permissoes: Permissao[];
  perfis: Array<{
    id: string;
    nome_perfil: string;
    area_funcional?: {
      id: string;
      nome_area: string;
    };
  }>;
  isLoading: boolean;
  isAdmin: boolean;
}

/**
 * Hook para verificar permissões do utilizador actual
 * Retorna as permissões, perfis e funções auxiliares
 */
export const usePermissions = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Obter utilizador actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Buscar permissões do utilizador
  const { data: permissoesData, isLoading: isLoadingPermissoes } = useQuery({
    queryKey: ["user-permissions", userId],
    queryFn: async () => {
      if (!userId) return { permissoes: [], perfis: [] };

      // Buscar perfis e permissões do utilizador
      const { data: utilizadorPerfis, error } = await supabase
        .from("utilizador_perfis")
        .select(`
          perfil_id,
          perfis_utilizador(
            id,
            nome_perfil,
            permissoes,
            area_funcional_id,
            areas_funcionais(
              id,
              nome_area
            )
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      // Extrair todas as permissões únicas
      const todasPermissoes = new Set<Permissao>();
      const perfis: UserPermissions["perfis"] = [];

      utilizadorPerfis?.forEach((up: any) => {
        const perfil = up.perfis_utilizador;
        if (perfil) {
          // Adicionar permissões
          perfil.permissoes?.forEach((p: Permissao) => todasPermissoes.add(p));

          // Adicionar perfil à lista
          perfis.push({
            id: perfil.id,
            nome_perfil: perfil.nome_perfil,
            area_funcional: perfil.areas_funcionais
              ? {
                  id: perfil.areas_funcionais.id,
                  nome_area: perfil.areas_funcionais.nome_area,
                }
              : undefined,
          });
        }
      });

      return {
        permissoes: Array.from(todasPermissoes),
        perfis,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    refetchOnWindowFocus: true,
  });

  // Verificar se é admin
  const { data: isAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ["user-is-admin", userId],
    queryFn: async () => {
      if (!userId) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) return false;
      return !!data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const permissoes = permissoesData?.permissoes || [];
  const perfis = permissoesData?.perfis || [];
  const isLoading = isLoadingPermissoes || isLoadingAdmin;

  /**
   * Verifica se o utilizador tem uma permissão específica
   */
  const hasPermission = (permissao: Permissao | Permissao[]): boolean => {
    // Admin tem todas as permissões
    if (isAdmin) return true;

    if (Array.isArray(permissao)) {
      // Se for array, verifica se tem pelo menos uma das permissões
      return permissao.some((p) => permissoes.includes(p));
    }

    return permissoes.includes(permissao);
  };

  /**
   * Verifica se o utilizador tem TODAS as permissões especificadas
   */
  const hasAllPermissions = (permissoesRequeridas: Permissao[]): boolean => {
    if (isAdmin) return true;
    return permissoesRequeridas.every((p) => permissoes.includes(p));
  };

  /**
   * Verifica se o utilizador tem um perfil específico
   */
  const hasPerfil = (nomePerfil: string): boolean => {
    return perfis.some((p) => p.nome_perfil === nomePerfil);
  };

  /**
   * Verifica se o utilizador pertence a uma área funcional
   */
  const hasAreaFuncional = (nomeArea: string): boolean => {
    return perfis.some((p) => p.area_funcional?.nome_area === nomeArea);
  };

  return {
    permissoes,
    perfis,
    isLoading,
    isAdmin: isAdmin || false,
    userId,
    hasPermission,
    hasAllPermissions,
    hasPerfil,
    hasAreaFuncional,
  };
};
