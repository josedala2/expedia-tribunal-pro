import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PedidoReducao {
  id: string;
  processo_id?: string;
  numero_processo: string;
  entidade_contratada: string;
  valor_emolumentos: number;
  valor_proposto: number;
  fundamentacao: string;
  documentos_anexos?: string;
  observacoes?: string;
  decisao?: string;
  promocao?: string;
  status: string;
  etapa_atual: string;
  data_submissao: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const usePedidosReducao = () => {
  const queryClient = useQueryClient();

  const { data: pedidos, isLoading } = useQuery({
    queryKey: ["pedidos-reducao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedidos_reducao_emolumentos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as PedidoReducao[];
    },
  });

  const createPedido = useMutation({
    mutationFn: async (pedido: Omit<PedidoReducao, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não autenticado");

      const { data, error } = await supabase
        .from("pedidos_reducao_emolumentos")
        .insert([{ ...pedido, criado_por: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos-reducao"] });
      toast.success("Pedido de redução registado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao registar pedido: ${error.message}`);
    },
  });

  const updatePedido = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PedidoReducao> & { id: string }) => {
      const { data, error } = await supabase
        .from("pedidos_reducao_emolumentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos-reducao"] });
      toast.success("Pedido atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar pedido: ${error.message}`);
    },
  });

  const deletePedido = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pedidos_reducao_emolumentos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos-reducao"] });
      toast.success("Pedido eliminado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar pedido: ${error.message}`);
    },
  });

  return {
    pedidos: pedidos || [],
    isLoading,
    createPedido,
    updatePedido,
    deletePedido,
  };
};