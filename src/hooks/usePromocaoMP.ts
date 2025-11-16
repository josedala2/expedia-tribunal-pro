import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PromocaoMP {
  id: string;
  processo_id?: string;
  procurador: string;
  data_promocao: string;
  tipo_parecer: string;
  decisao_juiz?: string;
  fundamentacao: string;
  recomendacoes?: string;
  status: string;
  prazo_restante?: number;
  criado_em?: string;
  atualizado_em?: string;
}

export const usePromocaoMP = () => {
  const queryClient = useQueryClient();

  const { data: promocoes, isLoading } = useQuery({
    queryKey: ["promocao-mp"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promocao_mp")
        .select("*")
        .order("criado_em", { ascending: false});

      if (error) throw error;
      return data as PromocaoMP[];
    },
  });

  const createPromocao = useMutation({
    mutationFn: async (promocao: Omit<PromocaoMP, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("promocao_mp")
        .insert([{ ...promocao, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocao-mp"] });
      toast.success("Promoção registada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar promoção: ${error.message}`);
    },
  });

  const updatePromocao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PromocaoMP> & { id: string }) => {
      const { data, error } = await supabase
        .from("promocao_mp")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocao-mp"] });
      toast.success("Promoção atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar promoção: ${error.message}`);
    },
  });

  const deletePromocao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("promocao_mp")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocao-mp"] });
      toast.success("Promoção eliminada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar promoção: ${error.message}`);
    },
  });

  return {
    promocoes: promocoes || [],
    isLoading,
    createPromocao,
    updatePromocao,
    deletePromocao,
  };
};