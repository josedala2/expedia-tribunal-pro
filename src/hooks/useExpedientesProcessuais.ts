import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ExpedienteProcessual {
  id: string;
  processo_id?: string;
  numero_expediente: string;
  tipo_expediente: string;
  assunto: string;
  origem: string;
  destino: string;
  data_entrada: string;
  urgencia: string;
  status: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useExpedientesProcessuais = () => {
  const queryClient = useQueryClient();

  const { data: expedientes, isLoading } = useQuery({
    queryKey: ["expedientes-processuais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expedientes_processuais")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as ExpedienteProcessual[];
    },
  });

  const createExpediente = useMutation({
    mutationFn: async (expediente: Omit<ExpedienteProcessual, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("expedientes_processuais")
        .insert([{ ...expediente, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedientes-processuais"] });
      toast.success("Expediente registado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar expediente: ${error.message}`);
    },
  });

  const updateExpediente = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExpedienteProcessual> & { id: string }) => {
      const { data, error } = await supabase
        .from("expedientes_processuais")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedientes-processuais"] });
      toast.success("Expediente atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar expediente: ${error.message}`);
    },
  });

  const deleteExpediente = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expedientes_processuais")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedientes-processuais"] });
      toast.success("Expediente eliminado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar expediente: ${error.message}`);
    },
  });

  return {
    expedientes: expedientes || [],
    isLoading,
    createExpediente,
    updateExpediente,
    deleteExpediente,
  };
};