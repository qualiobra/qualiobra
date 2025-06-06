
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoTipologia, CreateComodoData, UpdateComodoData } from "@/types/comodo";

export const useComodosTipologia = (tipologiaId?: string) => {
  const queryClient = useQueryClient();

  // Buscar cômodos por tipologia
  const { data: comodos = [], isLoading, error } = useQuery({
    queryKey: ['comodos-tipologia', tipologiaId],
    queryFn: async () => {
      if (!tipologiaId) return [];
      
      const { data, error } = await supabase
        .from('comodos_tipologia')
        .select('*')
        .eq('tipologia_id', tipologiaId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching comodos:', error);
        throw error;
      }
      
      return data as ComodoTipologia[];
    },
    enabled: !!tipologiaId,
  });

  // Criar cômodo
  const createComodo = useMutation({
    mutationFn: async (data: CreateComodoData) => {
      console.log('Criando cômodo com dados:', data);
      
      const { data: comodo, error } = await supabase
        .from('comodos_tipologia')
        .insert({
          tipologia_id: data.tipologia_id,
          nome: data.nome,
          descricao: data.descricao,
          comodo_master_id: data.comodo_master_id,
        })
        .select()
        .single();

      if (error) throw error;
      return comodo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comodos-tipologia', tipologiaId] });
      queryClient.invalidateQueries({ queryKey: ['comodos-count', tipologiaId] });
      toast({
        title: "Cômodo criado",
        description: "O cômodo foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating comodo:', error);
      let message = "Ocorreu um erro ao criar o cômodo.";
      
      if (error.message?.includes('unique_comodo_nome_por_tipologia')) {
        message = "Já existe um cômodo com este nome para esta tipologia.";
      }
      
      toast({
        title: "Erro ao criar cômodo",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Atualizar cômodo
  const updateComodo = useMutation({
    mutationFn: async (data: UpdateComodoData) => {
      console.log('Atualizando cômodo com dados:', data);
      
      const { id, ...updateData } = data;
      const { data: comodo, error } = await supabase
        .from('comodos_tipologia')
        .update({
          nome: updateData.nome,
          descricao: updateData.descricao,
          comodo_master_id: updateData.comodo_master_id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return comodo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comodos-tipologia', tipologiaId] });
      toast({
        title: "Cômodo atualizado",
        description: "O cômodo foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating comodo:', error);
      let message = "Ocorreu um erro ao atualizar o cômodo.";
      
      if (error.message?.includes('unique_comodo_nome_por_tipologia')) {
        message = "Já existe um cômodo com este nome para esta tipologia.";
      }
      
      toast({
        title: "Erro ao atualizar cômodo",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Deletar cômodo
  const deleteComodo = useMutation({
    mutationFn: async (comodoId: string) => {
      const { error } = await supabase
        .from('comodos_tipologia')
        .delete()
        .eq('id', comodoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comodos-tipologia', tipologiaId] });
      queryClient.invalidateQueries({ queryKey: ['comodos-count', tipologiaId] });
      toast({
        title: "Cômodo excluído",
        description: "O cômodo foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting comodo:', error);
      toast({
        title: "Erro ao excluir cômodo",
        description: "Ocorreu um erro ao excluir o cômodo.",
        variant: "destructive",
      });
    },
  });

  return {
    comodos,
    isLoading,
    error,
    createComodo: createComodo.mutate,
    updateComodo: updateComodo.mutate,
    deleteComodo: deleteComodo.mutate,
    isCreating: createComodo.isPending,
    isUpdating: updateComodo.isPending,
    isDeleting: deleteComodo.isPending,
  };
};
