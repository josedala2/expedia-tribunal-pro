import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CumprimentoDespacho {
  id: string;
  processo_id?: string;
  numero_processo: string;
  tipo_despacho: string;
  conteudo_despacho: string;
  data_emissao: string;
  responsavel: string;
  prazo_cumprimento?: string;
  status: string;
  data_cumprimento?: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useCumprimentosDespachos = () => {
  const queryClient = useQueryClient();

  const { data: cumprimentos, isLoading } = useQuery({
    queryKey: ["cumprimentos-despachos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cumprimentos_despachos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as CumprimentoDespacho[];
    },
  });

  const createCumprimento = useMutation({
    mutationFn: async (cumprimento: Omit<CumprimentoDespacho, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("cumprimentos_despachos")
        .insert([{ ...cumprimento, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cumprimentos-despachos"] });
      toast.success("Cumprimento de despacho registado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar cumprimento: ${error.message}`);
    },
  });

  const updateCumprimento = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CumprimentoDespacho> & { id: string }) => {
      const { data, error } = await supabase
        .from("cumprimentos_despachos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cumprimentos-despachos"] });
      toast.success("Cumprimento atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar cumprimento: ${error.message}`);
    },
  });

  const deleteCumprimento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cumprimentos_despachos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cumprimentos-despachos"] });
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