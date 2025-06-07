
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoItemUnified, ComodoTipologiaItemInsert, ComodoItemUpdate } from "@/types/comodoItensTypes";

export const useComodosItens = (comodoId?: string) => {
  const queryClient = useQueryClient();

  // Buscar todos os itens de um cômodo específico (herdados + específicos)
  const {
    data: comodoItens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-itens", comodoId],
    queryFn: async () => {
      if (!comodoId) return [];
      
      console.log("Buscando todos os itens do cômodo (nova estrutura):", comodoId);
      
      const { data, error } = await supabase
        .rpc('get_comodo_all_itens', {
          p_comodo_tipologia_id: comodoId
        });

      if (error) {
        console.error("Erro ao buscar itens do cômodo:", error);
        throw error;
      }

      console.log("Itens do cômodo encontrados (nova estrutura):", data);
      return data as ComodoItemUnified[];
    },
    enabled: !!comodoId,
  });

  // Criar associação cômodo-item (sempre específica para tipologia)
  const createComodoItemMutation = useMutation({
    mutationFn: async (data: ComodoTipologiaItemInsert) => {
      console.log("Criando associação cômodo tipologia-item:", data);
      
      const { data: result, error } = await supabase
        .rpc('add_item_to_comodo_tipologia_new', {
          p_comodo_tipologia_id: data.comodo_tipologia_id,
          p_item_id: data.item_id,
          p_obrigatorio: data.obrigatorio || false,
          p_ordem: data.ordem || 0
        });

      if (error) {
        console.error("Erro ao criar associação:", error);
        throw error;
      }

      console.log("Associação criada:", result);
      return result;
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

  // Atualizar associação cômodo-item (apenas para itens específicos)
  const updateComodoItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComodoItemUpdate }) => {
      console.log("Atualizando associação cômodo-item:", id, data);
      
      // Extrair o ID real removendo o prefixo
      const realId = id.replace('tipologia-', '');
      
      const { data: result, error } = await supabase
        .from('comodos_tipologia_itens')
        .update({
          obrigatorio: data.obrigatorio,
          ordem: data.ordem
        })
        .eq('id', realId)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar associação:", error);
        throw error;
      }

      console.log("Associação atualizada com sucesso");
      return result;
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

  // Remover associação cômodo-item (apenas para itens específicos)
  const deleteComodoItemMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Removendo associação cômodo-item:", id);
      
      // Verificar se é um item específico (pode ser removido)
      if (!id.startsWith('tipologia-')) {
        throw new Error("Não é possível remover itens herdados. Apenas itens específicos podem ser removidos.");
      }
      
      // Extrair o ID real removendo o prefixo
      const realId = id.replace('tipologia-', '');
      
      const { error } = await supabase
        .from('comodos_tipologia_itens')
        .delete()
        .eq('id', realId);

      if (error) {
        console.error("Erro ao remover associação:", error);
        throw error;
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
        description: error.message || "Erro ao remover item do cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Toggle obrigatório (apenas para itens específicos)
  const toggleObrigatorioMutation = useMutation({
    mutationFn: async ({ id, obrigatorio }: { id: string; obrigatorio: boolean }) => {
      console.log("Alterando obrigatoriedade:", id, obrigatorio);
      
      // Verificar se é um item específico (pode ser alterado)
      if (!id.startsWith('tipologia-')) {
        throw new Error("Não é possível alterar obrigatoriedade de itens herdados.");
      }
      
      // Extrair o ID real removendo o prefixo
      const realId = id.replace('tipologia-', '');
      
      const { data: result, error } = await supabase
        .from('comodos_tipologia_itens')
        .update({ obrigatorio: obrigatorio })
        .eq('id', realId)
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
        description: error.message || "Erro ao alterar obrigatoriedade. Tente novamente.",
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
