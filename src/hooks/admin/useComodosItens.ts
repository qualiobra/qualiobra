
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoItemWithDetails, ComodoItemInsert, ComodoItemUpdate } from "@/types/comodoItensTypes";

export const useComodosItens = (comodoId?: string) => {
  const queryClient = useQueryClient();

  // Buscar itens de um cômodo específico usando a VIEW que implementa herança
  const {
    data: comodoItens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-itens", comodoId],
    queryFn: async () => {
      if (!comodoId) return [];
      
      console.log("Buscando itens do cômodo (com herança):", comodoId);
      
      // Primeiro buscar da VIEW que inclui herança
      const { data: viewData, error: viewError } = await supabase
        .from('v_comodos_tipologia_itens')
        .select('*')
        .eq('comodo_id', comodoId);

      if (viewError) {
        console.error("Erro ao buscar da VIEW:", viewError);
        // Fallback para busca direta se VIEW falhar
        const { data, error } = await supabase
          .from('comodos_itens')
          .select(`
            *,
            itens_inspectionaveis!fk_comodos_itens_item (
              id,
              nome,
              descricao,
              categoria_id,
              categorias_itens (
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

        return data.map(item => ({
          id: item.id,
          comodo_id: item.comodo_id,
          item_id: item.item_id,
          obrigatorio: item.obrigatorio,
          ordem: item.ordem,
          created_at: item.created_at,
          updated_at: item.updated_at,
          item_nome: item.itens_inspectionaveis.nome,
          item_descricao: item.itens_inspectionaveis.descricao,
          categoria_nome: item.itens_inspectionaveis.categorias_itens.nome
        })) as ComodoItemWithDetails[];
      }

      // Agora buscar os detalhes dos itens baseados na VIEW
      const itemIds = viewData.map(item => item.item_id);
      if (itemIds.length === 0) return [];

      const { data: itensDetalhes, error: detalhesError } = await supabase
        .from('itens_inspectionaveis')
        .select(`
          id,
          nome,
          descricao,
          categorias_itens (
            nome
          )
        `)
        .in('id', itemIds);

      if (detalhesError) {
        console.error("Erro ao buscar detalhes dos itens:", detalhesError);
        throw detalhesError;
      }

      // Combinar dados da VIEW com detalhes dos itens
      const transformedData = viewData.map(viewItem => {
        const itemDetalhe = itensDetalhes.find(item => item.id === viewItem.item_id);
        return {
          id: `${viewItem.comodo_id}-${viewItem.item_id}`, // ID virtual para VIEW
          comodo_id: viewItem.comodo_id,
          item_id: viewItem.item_id,
          obrigatorio: viewItem.obrigatorio,
          ordem: viewItem.ordem,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          item_nome: itemDetalhe?.nome || 'Item não encontrado',
          item_descricao: itemDetalhe?.descricao || null,
          categoria_nome: itemDetalhe?.categorias_itens?.nome || 'Categoria não encontrada',
          origem: viewItem.origem // Adicionar informação sobre a origem (direto/herdado)
        };
      }).sort((a, b) => a.ordem - b.ordem);

      console.log("Itens do cômodo encontrados (com herança):", transformedData);
      return transformedData as ComodoItemWithDetails[];
    },
    enabled: !!comodoId,
  });

  // Criar associação cômodo-item usando a função que considera herança
  const createComodoItemMutation = useMutation({
    mutationFn: async (data: ComodoItemInsert) => {
      console.log("Criando associação cômodo-item (com herança):", data);
      
      // Usar a função que implementa herança
      const { data: result, error } = await supabase
        .rpc('add_item_to_comodo_tipologia', {
          p_comodo_tipologia_id: data.comodo_id,
          p_item_id: data.item_id,
          p_obrigatorio: data.obrigatorio,
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
