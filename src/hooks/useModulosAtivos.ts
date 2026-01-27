import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Modulo {
  id: string;
  codigo: string;
  nome: string;
  ativo: boolean;
}

// Mapeamento entre códigos de módulos e IDs de grupos do menu
const moduloToMenuGroup: Record<string, string[]> = {
  processos_visto: ["visto-group"],
  fiscalizacao: ["fiscalizacao-group"],
  prestacao_contas: ["prestacao-contas-group"],
  multas: ["multas-group"],
  expedientes: ["expedientes-group"],
  portal_intranet: ["portal-intranet-group"],
  relatorios: [], // Relatórios podem estar em vários lugares
  documentos: [], // Documentos podem estar em vários lugares
};

export const useModulosAtivos = () => {
  const { data: modulos = [], isLoading } = useQuery({
    queryKey: ['modulos-sistema-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modulos_sistema')
        .select('id, codigo, nome, ativo')
        .order('ordem');
      
      if (error) throw error;
      return data as Modulo[];
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  // Retorna os códigos dos módulos ativos
  const modulosAtivos = modulos.filter(m => m.ativo).map(m => m.codigo);

  // Retorna os IDs dos grupos de menu que devem ser exibidos
  const gruposMenuAtivos = new Set<string>();
  
  // Dashboard e Admin sempre visíveis
  gruposMenuAtivos.add("dashboard-group");
  gruposMenuAtivos.add("admin-config-group");

  // Adiciona grupos baseados nos módulos ativos
  modulosAtivos.forEach(codigoModulo => {
    const grupos = moduloToMenuGroup[codigoModulo] || [];
    grupos.forEach(grupo => gruposMenuAtivos.add(grupo));
  });

  // Função para verificar se um módulo está ativo
  const isModuloAtivo = (codigo: string) => modulosAtivos.includes(codigo);

  // Função para verificar se um grupo de menu deve ser exibido
  const isGrupoMenuVisivel = (grupoId: string) => gruposMenuAtivos.has(grupoId);

  return {
    modulos,
    modulosAtivos,
    isModuloAtivo,
    isGrupoMenuVisivel,
    isLoading,
  };
};
