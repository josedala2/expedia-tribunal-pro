import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TramitacaoProcesso {
  id: string;
  processo_id: string;
  numero_processo: string;
  etapa_atual: string;
  responsavel: string;
  data_inicio: string;
  prazo_dias?: number;
  status: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useTramitacaoProcessos = () => {
  const queryClient = useQueryClient();

  const { data: tramitacoes, isLoading } = useQuery({
    queryKey: ["tramitacao-processos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tramitacao_processos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as TramitacaoProcesso[];
    },
  });

  const createTramitacao = useMutation({
    mutationFn: async (tramitacao: Omit<TramitacaoProcesso, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("tramitacao_processos")
        .insert([{ ...tramitacao, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tramitacao-processos"] });
      toast.success("Tramitação registada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar tramitação: ${error.message}`);
    },
  });

  const updateTramitacao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TramitacaoProcesso> & { id: string }) => {
      const { data, error } = await supabase
        .from("tramitacao_processos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tramitacao-processos"] });
      toast.success("Tramitação atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar tramitação: ${error.message}`);
    },
  });

  const deleteTramitacao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tramitacao_processos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tramitacao-processos"] });
      toast.success("Tramitação eliminada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar tramitação: ${error.message}`);
    },
  });

  return {
    tramitacoes: tramitacoes || [],
    isLoading,
    createTramitacao,
    updateTramitacao,
    deleteTramitacao,
  };
};