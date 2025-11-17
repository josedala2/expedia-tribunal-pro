import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CumprimentoDespachoADFJR {
  id: string;
  processo_id?: string;
  numero_processo: string;
  entidade: string;
  numero_despacho: string;
  data_despacho: string;
  data_cumprimento?: string;
  responsavel: string;
  status: string;
  descricao_despacho: string;
  acoes_tomadas?: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useCumprimentosDespachoADFJR = () => {
  const queryClient = useQueryClient();

  const { data: cumprimentos, isLoading } = useQuery({
    queryKey: ["cumprimentos-despacho-adfjr"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cumprimentos_despacho_adfjr")
        .select("*")
        .order("criado_em", { ascending: false});

      if (error) throw error;
      return data as CumprimentoDespachoADFJR[];
    },
  });

  const createCumprimento = useMutation({
    mutationFn: async (cumprimento: Omit<CumprimentoDespachoADFJR, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("cumprimentos_despacho_adfjr")
        .insert([{ ...cumprimento, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cumprimentos-despacho-adfjr"] });
      toast.success("Cumprimento de despacho ADFJR registado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar cumprimento: ${error.message}`);
    },
  });

  const updateCumprimento = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CumprimentoDespachoADFJR> & { id: string }) => {
      const { data, error } = await supabase
        .from("cumprimentos_despacho_adfjr")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cumprimentos-despacho-adfjr"] });
      toast.success("Cumprimento atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar cumprimento: ${error.message}`);
    },
  });

  const deleteCumprimento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cumprimentos_despacho_adfjr")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cumprimentos-despacho-adfjr"] });
      toast.success("Cumprimento eliminado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar cumprimento: ${error.message}`);
    },
  });

  return {
    cumprimentos: cumprimentos || [],
    isLoading,
    createCumprimento,
    updateCumprimento,
    deleteCumprimento,
  };
};