import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ConclusaoAuto {
  id: string;
  processo_id?: string;
  numero_termo: string;
  escrivao: string;
  destinatario: string;
  data_conclusao: string;
  motivo?: string;
  status: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useConclusaoAutos = () => {
  const queryClient = useQueryClient();

  const { data: conclusoes, isLoading } = useQuery({
    queryKey: ["conclusao-autos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conclusao_autos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as ConclusaoAuto[];
    },
  });

  const createConclusao = useMutation({
    mutationFn: async (conclusao: Omit<ConclusaoAuto, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("conclusao_autos")
        .insert([{ ...conclusao, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conclusao-autos"] });
      toast.success("Conclusão registada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar conclusão: ${error.message}`);
    },
  });

  const updateConclusao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ConclusaoAuto> & { id: string }) => {
      const { data, error } = await supabase
        .from("conclusao_autos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conclusao-autos"] });
      toast.success("Conclusão atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar conclusão: ${error.message}`);
    },
  });

  const deleteConclusao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("conclusao_autos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conclusao-autos"] });
      toast.success("Conclusão eliminada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar conclusão: ${error.message}`);
    },
  });

  return {
    conclusoes: conclusoes || [],
    isLoading,
    createConclusao,
    updateConclusao,
    deleteConclusao,
  };
};