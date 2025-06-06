
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ItemInspecionavel, CategoriaItem, ItemInspecionavelInsert, ItemInspecionavelUpdate, CategoriaItemInsert, CategoriaItemUpdate } from "@/types/itemTypes";
import { toast } from "@/hooks/use-toast";

export const useItensAdmin = () => {
  const queryClient = useQueryClient();

  // Query para categorias
  const {
    data: categorias = [],
    isLoading: isLoadingCategorias,
    error: categoriasError,
  } = useQuery({
    queryKey: ["categorias-admin"],
    queryFn: async () => {
      console.log("Buscando categorias");
      
      const { data, error } = await supabase
        .from('categorias_itens')
        .select('*')
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
      }

      console.log("Categorias encontradas:", data);
      return data as CategoriaItem[];
    },
  });

  // Query para itens
  const {
    data: itens = [],
    isLoading: isLoadingItens,
    error: itensError,
  } = useQuery({
    queryKey: ["itens-admin"],
    queryFn: async () => {
      console.log("Buscando itens inspectionáveis");
      
      const { data, error } = await supabase
        .from('itens_inspectionaveis')
        .select(`
          *,
          categorias_itens!inner (
            nome
          )
        `)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar itens:", error);
        throw error;
      }

      console.log("Itens encontrados:", data);
      
      // Transformar dados para incluir categoria_nome
      const transformedData = data.map(item => ({
        ...item,
        categoria_nome: item.categorias_itens.nome
      }));
      
      return transformedData as (ItemInspecionavel & { categoria_nome: string })[];
    },
  });

  // Mutation para criar categoria
  const createCategoriaMutation = useMutation({
    mutationFn: async (data: CategoriaItemInsert) => {
      console.log("Criando categoria:", data);
      
      const { data: result, error } = await supabase
        .from('categorias_itens')
        .insert({
          nome: data.nome,
          descricao: data.descricao || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar categoria:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar categoria
  const updateCategoriaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoriaItemUpdate }) => {
      console.log("Atualizando categoria:", id, data);
      
      const { error } = await supabase
        .from('categorias_itens')
        .update({
          nome: data.nome,
          descricao: data.descricao || null,
        })
        .eq('id', id);

      if (error) {
        console.error("Erro ao atualizar categoria:", error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar categoria:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive",
      });
    },
  });

  // Mutation para toggle status da categoria
  const toggleCategoriaStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      console.log("Alterando status da categoria:", id, ativo);
      
      const { error } = await supabase
        .from('categorias_itens')
        .update({ ativo })
        .eq('id', id);

      if (error) {
        console.error("Erro ao alterar status da categoria:", error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-admin"] });
      queryClient.invalidateQueries({ queryKey: ["itens-admin"] });
      toast({
        title: "Sucesso",
        description: "Status da categoria alterado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao alterar status da categoria:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da categoria",
        variant: "destructive",
      });
    },
  });

  // Mutation para criar item
  const createItemMutation = useMutation({
    mutationFn: async (data: ItemInspecionavelInsert) => {
      console.log("Criando item:", data);
      
      const { data: result, error } = await supabase
        .from('itens_inspectionaveis')
        .insert({
          nome: data.nome,
          descricao: data.descricao || null,
          categoria_id: data.categoria_id,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar item:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens-admin"] });
      toast({
        title: "Sucesso",
        description: "Item criado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao criar item:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar item",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar item
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ItemInspecionavelUpdate }) => {
      console.log("Atualizando item:", id, data);
      
      const { error } = await supabase
        .from('itens_inspectionaveis')
        .update({
          nome: data.nome,
          descricao: data.descricao || null,
          categoria_id: data.categoria_id,
        })
        .eq('id', id);

      if (error) {
        console.error("Erro ao atualizar item:", error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens-admin"] });
      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar item:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar item",
        variant: "destructive",
      });
    },
  });

  // Mutation para toggle status do item
  const toggleItemStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      console.log("Alterando status do item:", id, ativo);
      
      const { error } = await supabase
        .from('itens_inspectionaveis')
        .update({ ativo })
        .eq('id', id);

      if (error) {
        console.error("Erro ao alterar status do item:", error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens-admin"] });
      toast({
        title: "Sucesso",
        description: "Status do item alterado com sucesso",
      });
    },
    onError: (error) => {
      console.error("Erro ao alterar status do item:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do item",
        variant: "destructive",
      });
    },
  });

  return {
    // Dados
    categorias,
    itens,
    
    // Estados de loading
    isLoadingCategorias,
    isLoadingItens,
    isLoading: isLoadingCategorias || isLoadingItens,
    
    // Erros
    error: categoriasError || itensError,
    
    // Funções para categorias
    createCategoria: createCategoriaMutation.mutate,
    updateCategoria: updateCategoriaMutation.mutate,
    toggleCategoriaStatus: toggleCategoriaStatusMutation.mutate,
    
    // Funções para itens
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    toggleItemStatus: toggleItemStatusMutation.mutate,
    
    // Estados de loading das mutations
    isCreatingCategoria: createCategoriaMutation.isPending,
    isUpdatingCategoria: updateCategoriaMutation.isPending,
    isTogglingCategoriaStatus: toggleCategoriaStatusMutation.isPending,
    
    isCreatingItem: createItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isTogglingItemStatus: toggleItemStatusMutation.isPending,
  };
};
