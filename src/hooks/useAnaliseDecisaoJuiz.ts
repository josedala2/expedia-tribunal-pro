import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnaliseDecisao {
  id: string;
  processo_id?: string;
  juiz_relator: string;
  data_analise: string;
  tipo_decisao: string;
  valor_original?: number;
  valor_deferido?: number;
  fundamentacao: string;
  status: string;
  prazo_restante?: number;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useAnaliseDecisaoJuiz = () => {
  const queryClient = useQueryClient();

  const { data: analises, isLoading } = useQuery({
    queryKey: ["analise-decisao-juiz"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analise_decisao_juiz")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as AnaliseDecisao[];
    },
  });

  const createAnalise = useMutation({
    mutationFn: async (analise: Omit<AnaliseDecisao, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("analise_decisao_juiz")
        .insert([{ ...analise, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analise-decisao-juiz"] });
      toast.success("Análise registada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar análise: ${error.message}`);
    },
  });

  const updateAnalise = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AnaliseDecisao> & { id: string }) => {
      const { data, error } = await supabase
        .from("analise_decisao_juiz")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analise-decisao-juiz"] });
      toast.success("Análise atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar análise: ${error.message}`);
    },
  });

  const deleteAnalise = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("analise_decisao_juiz")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analise-decisao-juiz"] });
      toast.success("Análise eliminada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar análise: ${error.message}`);
    },
  });

  return {
    analises: analises || [],
    isLoading,
    createAnalise,
    updateAnalise,
    deleteAnalise,
  };
};