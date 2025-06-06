import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ItemFormData, CategoriaFormData } from "@/components/admin/schemas/itemFormSchema";
import { ItemInspecionavel, CategoriaItem } from "@/types/itemTypes";

export const useItensAdmin = () => {
  const queryClient = useQueryClient();

  // Buscar todas as categorias usando RPC
  const {
    data: categorias = [],
    isLoading: isLoadingCategorias,
    error: categoriasError,
  } = useQuery({
    queryKey: ["categorias-itens"],
    queryFn: async () => {
      console.log("Buscando categorias de itens via RPC...");
      
      const { data, error } = await supabase.rpc('get_categorias_itens');
      
      if (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
      }

      console.log("Categorias encontradas:", data);
      return data as CategoriaItem[];
    },
  });

  // Buscar todos os itens inspecionáveis usando RPC
  const {
    data: itens = [],
    isLoading: isLoadingItens,
    error: itensError,
  } = useQuery({
    queryKey: ["itens-inspectionaveis"],
    queryFn: async () => {
      console.log("Buscando itens inspecionáveis via RPC...");
      
      const { data, error } = await supabase.rpc('get_itens_inspectionaveis');
      
      if (error) {
        console.error("Erro ao buscar itens:", error);
        throw error;
      }

      console.log("Itens encontrados:", data);
      return data as (ItemInspecionavel & { categoria_nome: string })[];
    },
  });

  // Criar nova categoria usando RPC
  const createCategoriaMutation = useMutation({
    mutationFn: async (data: CategoriaFormData) => {
      console.log("Criando categoria via RPC:", { nome: data.nome, descricao: data.descricao });
      
      const { data: result, error } = await supabase.rpc('create_categoria_item', {
        p_nome: data.nome,
        p_descricao: data.descricao || null
      });

      console.log("Resposta do Supabase:", { data: result, error });

      if (error) {
        console.error("Erro detalhado:", error);
        throw error;
      }

      console.log("Categoria criada com ID:", result);
      return { id: result, ...data } as CategoriaItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-itens"] });
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de criação de categoria:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Criar novo item inspecionável usando RPC
  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      console.log("Criando item via RPC:", { nome: data.nome, descricao: data.descricao, categoria_id: data.categoria_id });
      
      const { data: result, error } = await supabase.rpc('create_item_inspecionavel', {
        p_nome: data.nome,
        p_descricao: data.descricao || null,
        p_categoria_id: data.categoria_id
      });

      console.log("Resposta do Supabase:", { data: result, error });

      if (error) {
        console.error("Erro detalhado:", error);
        throw error;
      }

      console.log("Item criado com ID:", result);
      return { id: result, ...data } as ItemInspecionavel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens-inspectionaveis"] });
      toast({
        title: "Sucesso",
        description: "Item criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de criação de item:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar item. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Atualizar categoria existente usando RPC
  const updateCategoriaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoriaFormData }) => {
      console.log("Atualizando categoria via RPC:", id, data);
      
      const { data: result, error } = await supabase.rpc('update_categoria_item', {
        p_id: id,
        p_nome: data.nome,
        p_descricao: data.descricao || null
      });

      if (error) {
        console.error("Erro ao atualizar categoria:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Categoria não encontrada");
      }

      console.log("Categoria atualizada com sucesso");
      return { id, ...data } as CategoriaItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-itens"] });
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de atualização de categoria:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Atualizar item existente usando RPC
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ItemFormData }) => {
      console.log("Atualizando item via RPC:", id, data);
      
      const { data: result, error } = await supabase.rpc('update_item_inspecionavel', {
        p_id: id,
        p_nome: data.nome,
        p_descricao: data.descricao || null,
        p_categoria_id: data.categoria_id
      });

      if (error) {
        console.error("Erro ao atualizar item:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Item não encontrado");
      }

      console.log("Item atualizado com sucesso");
      return { id, ...data } as ItemInspecionavel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens-inspectionaveis"] });
      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de atualização de item:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar item. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Ativar/desativar categoria usando RPC
  const toggleCategoriaStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      console.log("Alterando status da categoria via RPC:", id, ativo);
      
      const { data: result, error } = await supabase.rpc('toggle_categoria_item', {
        p_id: id,
        p_ativo: ativo
      });

      if (error) {
        console.error("Erro ao alterar status da categoria:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Categoria não encontrada");
      }

      console.log("Status da categoria alterado com sucesso");
      return { id, ativo };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categorias-itens"] });
      toast({
        title: "Sucesso",
        description: `Categoria ${variables.ativo ? "ativada" : "desativada"} com sucesso!`,
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de status de categoria:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Ativar/desativar item usando RPC
  const toggleItemStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      console.log("Alterando status do item via RPC:", id, ativo);
      
      const { data: result, error } = await supabase.rpc('toggle_item_inspecionavel', {
        p_id: id,
        p_ativo: ativo
      });

      if (error) {
        console.error("Erro ao alterar status do item:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Item não encontrado");
      }

      console.log("Status do item alterado com sucesso");
      return { id, ativo };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itens-inspectionaveis"] });
      toast({
        title: "Sucesso",
        description: `Item ${variables.ativo ? "ativado" : "desativado"} com sucesso!`,
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de status de item:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do item. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    // Categorias
    categorias,
    isLoadingCategorias,
    categoriasError,
    createCategoria: createCategoriaMutation.mutate,
    updateCategoria: updateCategoriaMutation.mutate,
    toggleCategoriaStatus: toggleCategoriaStatusMutation.mutate,
    isCreatingCategoria: createCategoriaMutation.isPending,
    isUpdatingCategoria: updateCategoriaMutation.isPending,
    isTogglingCategoriaStatus: toggleCategoriaStatusMutation.isPending,

    // Itens
    itens,
    isLoadingItens,
    itensError,
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    toggleItemStatus: toggleItemStatusMutation.mutate,
    isCreatingItem: createItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isTogglingItemStatus: toggleItemStatusMutation.isPending,
  };
};
