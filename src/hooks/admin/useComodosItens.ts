
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoItemWithDetails, ComodoItemInsert, ComodoItemUpdate } from "@/types/comodoItensTypes";

export const useComodosItens = (comodoId?: string) => {
  const queryClient = useQueryClient();

  // Buscar itens de um cômodo específico
  const {
    data: comodoItens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-itens", comodoId],
    queryFn: async () => {
      if (!comodoId) return [];
      
      console.log("Buscando itens do cômodo via RPC:", comodoId);
      
      const { data, error } = await supabase.rpc('get_comodos_itens_by_comodo', {
        p_comodo_id: comodoId
      });
      
      if (error) {
        console.error("Erro ao buscar itens do cômodo:", error);
        throw error;
      }

      console.log("Itens do cômodo encontrados:", data);
      return data as ComodoItemWithDetails[];
    },
    enabled: !!comodoId,
  });

  // Criar associação cômodo-item
  const createComodoItemMutation = useMutation({
    mutationFn: async (data: ComodoItemInsert) => {
      console.log("Criando associação cômodo-item via RPC:", data);
      
      const { data: result, error } = await supabase.rpc('create_comodo_item', {
        p_comodo_id: data.comodo_id,
        p_item_id: data.item_id,
        p_obrigatorio: data.obrigatorio || false,
        p_ordem: data.ordem || 0
      });

      if (error) {
        console.error("Erro ao criar associação:", error);
        throw error;
      }

      console.log("Associação criada com ID:", result);
      return { id: result, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-itens"] });
      toast({
        title: "Sucesso",
        description: "Item associado ao cômodo com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de criação:", error);
      toast({
        title: "Erro",
        description: "Erro ao associar item ao cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Atualizar associação cômodo-item
  const updateComodoItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComodoItemUpdate }) => {
      console.log("Atualizando associação cômodo-item via RPC:", id, data);
      
      const currentItem = comodoItens.find(item => item.id === id);
      if (!currentItem) {
        throw new Error("Item não encontrado");
      }

      const { data: result, error } = await supabase.rpc('update_comodo_item', {
        p_id: id,
        p_obrigatorio: data.obrigatorio ?? currentItem.obrigatorio,
        p_ordem: data.ordem ?? currentItem.ordem
      });

      if (error) {
        console.error("Erro ao atualizar associação:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Associação não encontrada");
      }

      console.log("Associação atualizada com sucesso");
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-itens"] });
      toast({
        title: "Sucesso",
        description: "Associação atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de atualização:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar associação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Remover associação cômodo-item
  const deleteComodoItemMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Removendo associação cômodo-item via RPC:", id);
      
      const { data: result, error } = await supabase.rpc('delete_comodo_item', {
        p_id: id
      });

      if (error) {
        console.error("Erro ao remover associação:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Associação não encontrada");
      }

      console.log("Associação removida com sucesso");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-itens"] });
      toast({
        title: "Sucesso",
        description: "Item removido do cômodo com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de remoção:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover item do cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Toggle obrigatório
  const toggleObrigatorioMutation = useMutation({
    mutationFn: async ({ id, obrigatorio }: { id: string; obrigatorio: boolean }) => {
      console.log("Alterando obrigatoriedade via RPC:", id, obrigatorio);
      
      const { data: result, error } = await supabase.rpc('toggle_comodo_item_obrigatorio', {
        p_id: id,
        p_obrigatorio: obrigatorio
      });

      if (error) {
        console.error("Erro ao alterar obrigatoriedade:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Associação não encontrada");
      }

      console.log("Obrigatoriedade alterada com sucesso");
      return { id, obrigatorio };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comodos-itens"] });
      toast({
        title: "Sucesso",
        description: `Item marcado como ${variables.obrigatorio ? "obrigatório" : "opcional"}!`,
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de obrigatoriedade:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar obrigatoriedade. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    comodoItens,
    isLoading,
    error,
    createComodoItem: createComodoItemMutation.mutate,
    updateComodoItem: updateComodoItemMutation.mutate,
    deleteComodoItem: deleteComodoItemMutation.mutate,
    toggleObrigatorio: toggleObrigatorioMutation.mutate,
    isCreating: createComodoItemMutation.isPending,
    isUpdating: updateComodoItemMutation.isPending,
    isDeleting: deleteComodoItemMutation.isPending,
    isTogglingObrigatorio: toggleObrigatorioMutation.isPending,
  };
};
