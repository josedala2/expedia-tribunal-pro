import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProcessoVisto {
  id: string;
  numero: string;
  tipo: string;
  natureza?: string;
  entidade_contratante?: string;
  entidade_adjudicataria?: string;
  objeto: string;
  valor_contrato?: number;
  fonte_financiamento?: string;
  divisao?: string;
  seccao?: string;
  juiz_relator?: string;
  juiz_adjunto?: string;
  data_visto_tacito?: string;
  status: string;
  prioridade: string;
  prazo_dias?: number;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useProcessosVisto = () => {
  const queryClient = useQueryClient();

  const { data: processos, isLoading } = useQuery({
    queryKey: ["processos-visto"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processos_visto")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as ProcessoVisto[];
    },
  });

  const createProcesso = useMutation({
    mutationFn: async (processo: Omit<ProcessoVisto, 'id' | 'criado_em' | 'atualizado_em'>) => {
      console.log('Verificando autenticação do usuário...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Erro ao verificar autenticação:', authError);
        throw new Error("Erro ao verificar autenticação");
      }
      
      if (!user) {
        console.error('Usuário não autenticado');
        throw new Error("Você precisa estar autenticado para criar um processo");
      }
      
      console.log('Usuário autenticado:', user.id);
      console.log('Inserindo processo na base de dados...');

      const { data, error } = await supabase
        .from("processos_visto")
        .insert([{ ...processo, criado_por: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao inserir processo:', error);
        throw error;
      }
      
      console.log('Processo inserido com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processos-visto"] });
      toast.success("Processo criado com sucesso!");
    },
    onError: (error: any) => {
      console.error('Erro na mutation:', error);
      const errorMessage = error?.message || "Erro desconhecido ao criar processo";
      toast.error(`Erro ao criar processo: ${errorMessage}`);
    },
  });

  const updateProcesso = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProcessoVisto> & { id: string }) => {
      const { data, error } = await supabase
        .from("processos_visto")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processos-visto"] });
      toast.success("Processo atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar processo: ${error.message}`);
    },
  });

  const deleteProcesso = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("processos_visto")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processos-visto"] });
      toast.success("Processo eliminado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar processo: ${error.message}`);
    },
  });

  return {
    processos: processos || [],
    isLoading,
    createProcesso,
    updateProcesso,
    deleteProcesso,
  };
};