
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoMasterItemWithDetails, ComodoMasterItemInsert, ComodoItemUpdate } from "@/types/comodoItensTypes";

export const useComodosMaxterItens = (comodoMasterId?: string) => {
  const queryClient = useQueryClient();

  // Buscar itens de um cômodo master específico
  const {
    data: comodoMasterItens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-master-itens", comodoMasterId],
    queryFn: async () => {
      if (!comodoMasterId) return [];
      
      console.log("Buscando itens do cômodo master:", comodoMasterId);
      
      const { data, error } = await supabase
        .rpc('get_comodos_master_itens', {
          p_comodo_master_id: comodoMasterId
        });

      if (error) {
        console.error("Erro ao buscar itens do cômodo master:", error);
        throw error;
      }

      console.log("Itens do cômodo master encontrados:", data);
      return data as ComodoMasterItemWithDetails[];
    },
    enabled: !!comodoMasterId,
  });

  // Criar associação cômodo master-item
  const createComodoMasterItemMutation = useMutation({
    mutationFn: async (data: ComodoMasterItemInsert) => {
      console.log("Criando associação cômodo master-item:", data);
      
      const { data: result, error } = await supabase
        .rpc('add_item_to_comodo_master', {
          p_comodo_master_id: data.comodo_master_id,
          p_item_id: data.item_id,
          p_obrigatorio: data.obrigatorio || false,
          p_ordem: data.ordem || 0
        });

      if (error) {
        console.error("Erro ao criar associação cômodo master-item:", error);
        throw error;
      }

      console.log("Associação cômodo master-item criada:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master-itens"] });
      toast({
        title: "Sucesso",
        description: "Item associado ao cômodo padrão com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de criação:", error);
      toast({
        title: "Erro",
        description: "Erro ao associar item ao cômodo padrão. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Atualizar associação cômodo master-item
  const updateComodoMasterItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComodoItemUpdate }) => {
      console.log("Atualizando associação cômodo master-item:", id, data);
      
      const { data: result, error } = await supabase
        .from('comodos_master_itens')
        .update({
          obrigatorio: data.obrigatorio,
          ordem: data.ordem
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar associação cômodo master-item:", error);
        throw error;
      }

      console.log("Associação cômodo master-item atualizada com sucesso");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master-itens"] });
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

  // Remover associação cômodo master-item
  const deleteComodoMasterItemMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Removendo associação cômodo master-item:", id);
      
      const { error } = await supabase
        .from('comodos_master_itens')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao remover associação cômodo master-item:", error);
        throw error;
      }

      console.log("Associação cômodo master-item removida com sucesso");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master-itens"] });
      toast({
        title: "Sucesso",
        description: "Item removido do cômodo padrão com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de remoção:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover item do cômodo padrão. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Toggle obrigatório
  const toggleObrigatorioMutation = useMutation({
    mutationFn: async ({ id, obrigatorio }: { id: string; obrigatorio: boolean }) => {
      console.log("Alterando obrigatoriedade cômodo master:", id, obrigatorio);
      
      const { data: result, error } = await supabase
        .from('comodos_master_itens')
        .update({ obrigatorio: obrigatorio })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao alterar obrigatoriedade:", error);
        throw error;
      }

      console.log("Obrigatoriedade alterada com sucesso");
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master-itens"] });
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
    comodoMasterItens,
    isLoading,
    error,
    createComodoMasterItem: createComodoMasterItemMutation.mutate,
    updateComodoMasterItem: updateComodoMasterItemMutation.mutate,
    deleteComodoMasterItem: deleteComodoMasterItemMutation.mutate,
    toggleObrigatorio: toggleObrigatorioMutation.mutate,
    isCreating: createComodoMasterItemMutation.isPending,
    isUpdating: updateComodoMasterItemMutation.isPending,
    isDeleting: deleteComodoMasterItemMutation.isPending,
    isTogglingObrigatorio: toggleObrigatorioMutation.isPending,
  };
};
