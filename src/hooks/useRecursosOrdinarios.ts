import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RecursoOrdinario {
  id: string;
  numero_recurso: string;
  processo_original: string;
  recorrente: string;
  data_interposicao: string;
  estado: string;
  fundamento: string;
  observacoes?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const useRecursosOrdinarios = () => {
  const queryClient = useQueryClient();

  const { data: recursos, isLoading } = useQuery({
    queryKey: ["recursos-ordinarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recursos_ordinarios")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as RecursoOrdinario[];
    },
  });

  const createRecurso = useMutation({
    mutationFn: async (recurso: Omit<RecursoOrdinario, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("recursos_ordinarios")
        .insert([{ ...recurso, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recursos-ordinarios"] });
      toast.success("Recurso criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar recurso: ${error.message}`);
    },
  });

  const updateRecurso = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RecursoOrdinario> & { id: string }) => {
      const { data, error } = await supabase
        .from("recursos_ordinarios")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recursos-ordinarios"] });
      toast.success("Recurso atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar recurso: ${error.message}`);
    },
  });

  const deleteRecurso = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recursos_ordinarios")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recursos-ordinarios"] });
      toast.success("Recurso eliminado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar recurso: ${error.message}`);
    },
  });

  return {
    recursos: recursos || [],
    isLoading,
    createRecurso,
    updateRecurso,
    deleteRecurso,
  };
};