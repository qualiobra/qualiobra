
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
      
      console.log("Buscando itens do cômodo:", comodoId);
      
      const { data, error } = await supabase
        .from('comodos_itens')
        .select(`
          id,
          comodo_id,
          item_id,
          obrigatorio,
          ordem,
          created_at,
          itens_inspectionaveis!comodos_itens_item_id_fkey (
            id,
            nome,
            descricao,
            categorias_itens!inner (
              nome
            )
          )
        `)
        .eq('comodo_id', comodoId)
        .order('ordem');
      
      if (error) {
        console.error("Erro ao buscar itens do cômodo:", error);
        throw error;
      }

      console.log("Itens do cômodo encontrados:", data);
      
      // Transformar dados para o formato esperado
      const transformedData = data.map(item => ({
        id: item.id,
        comodo_id: item.comodo_id,
        item_id: item.item_id,
        obrigatorio: item.obrigatorio,
        ordem: item.ordem,
        created_at: item.created_at,
        updated_at: item.created_at,
        item_nome: item.itens_inspectionaveis.nome,
        item_descricao: item.itens_inspectionaveis.descricao,
        categoria_nome: item.itens_inspectionaveis.categorias_itens.nome
      }));

      return transformedData as ComodoItemWithDetails[];
    },
    enabled: !!comodoId,
  });

  // Criar associação cômodo-item
  const createComodoItemMutation = useMutation({
    mutationFn: async (data: ComodoItemInsert) => {
      console.log("Criando associação cômodo-item:", data);
      
      const { data: result, error } = await supabase
        .from('comodos_itens')
        .insert({
          comodo_id: data.comodo_id,
          item_id: data.item_id,
          obrigatorio: data.obrigatorio,
          ordem: data.ordem || 0
        })
        .select()
        .single();

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

  // Atualizar associação cômodo-item
  const updateComodoItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComodoItemUpdate }) => {
      console.log("Atualizando associação cômodo-item:", id, data);
      
      const { data: result, error } = await supabase
        .from('comodos_itens')
        .update({
          obrigatorio: data.obrigatorio,
          ordem: data.ordem
        })
        .eq('id', id)
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

  // Remover associação cômodo-item
  const deleteComodoItemMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Removendo associação cômodo-item:", id);
      
      const { error } = await supabase
        .from('comodos_itens')
        .delete()
        .eq('id', id);

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
        description: "Erro ao remover item do cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Toggle obrigatório
  const toggleObrigatorioMutation = useMutation({
    mutationFn: async ({ id, obrigatorio }: { id: string; obrigatorio: boolean }) => {
      console.log("Alterando obrigatoriedade:", id, obrigatorio);
      
      const { data: result, error } = await supabase
        .from('comodos_itens')
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
