import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SaidaExpediente {
  id: string;
  processo_id?: string;
  numero_expediente: string;
  tipo_documento: string;
  destinatario: string;
  assunto: string;
  data_envio: string;
  forma_envio: string;
  numero_registo?: string;
  status: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useSaidasExpedientes = () => {
  const queryClient = useQueryClient();

  const { data: saidas, isLoading } = useQuery({
    queryKey: ["saidas-expedientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saidas_expedientes")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as SaidaExpediente[];
    },
  });

  const createSaida = useMutation({
    mutationFn: async (saida: Omit<SaidaExpediente, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("saidas_expedientes")
        .insert([{ ...saida, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas-expedientes"] });
      toast.success("Saída de expediente registada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar saída: ${error.message}`);
    },
  });

  const updateSaida = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SaidaExpediente> & { id: string }) => {
      const { data, error } = await supabase
        .from("saidas_expedientes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas-expedientes"] });
      toast.success("Saída atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar saída: ${error.message}`);
    },
  });

  const deleteSaida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("saidas_expedientes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas-expedientes"] });
      toast.success("Saída eliminada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar saída: ${error.message}`);
    },
  });

  return {
    saidas: saidas || [],
    isLoading,
    createSaida,
    updateSaida,
    deleteSaida,
  };
};