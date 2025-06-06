
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tipologia, CreateTipologiaData, UpdateTipologiaData } from "@/types/tipologia";

export const useTipologias = (obraId?: string) => {
  const queryClient = useQueryClient();

  // Buscar tipologias por obra
  const { data: tipologias = [], isLoading, error } = useQuery({
    queryKey: ['tipologias', obraId],
    queryFn: async () => {
      if (!obraId) return [];
      
      const { data, error } = await supabase
        .from('tipologias')
        .select('*')
        .eq('obra_id', obraId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tipologias:', error);
        throw error;
      }
      
      return data as Tipologia[];
    },
    enabled: !!obraId,
  });

  // Criar tipologia
  const createTipologia = useMutation({
    mutationFn: async (data: CreateTipologiaData) => {
      const { data: tipologia, error } = await supabase
        .from('tipologias')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return tipologia;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipologias', obraId] });
      toast({
        title: "Tipologia criada",
        description: "A tipologia foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating tipologia:', error);
      let message = "Ocorreu um erro ao criar a tipologia.";
      
      if (error.message?.includes('unique_tipologia_nome_por_obra')) {
        message = "Já existe uma tipologia com este nome para esta obra.";
      }
      
      toast({
        title: "Erro ao criar tipologia",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Atualizar tipologia
  const updateTipologia = useMutation({
    mutationFn: async (data: UpdateTipologiaData) => {
      const { id, ...updateData } = data;
      const { data: tipologia, error } = await supabase
        .from('tipologias')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return tipologia;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipologias', obraId] });
      toast({
        title: "Tipologia atualizada",
        description: "A tipologia foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating tipologia:', error);
      let message = "Ocorreu um erro ao atualizar a tipologia.";
      
      if (error.message?.includes('unique_tipologia_nome_por_obra')) {
        message = "Já existe uma tipologia com este nome para esta obra.";
      }
      
      toast({
        title: "Erro ao atualizar tipologia",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Deletar tipologia
  const deleteTipologia = useMutation({
    mutationFn: async (tipologiaId: string) => {
      const { error } = await supabase
        .from('tipologias')
        .delete()
        .eq('id', tipologiaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipologias', obraId] });
      toast({
        title: "Tipologia excluída",
        description: "A tipologia foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting tipologia:', error);
      toast({
        title: "Erro ao excluir tipologia",
        description: "Ocorreu um erro ao excluir a tipologia.",
        variant: "destructive",
      });
    },
  });

  return {
    tipologias,
    isLoading,
    error,
    createTipologia: createTipologia.mutate,
    updateTipologia: updateTipologia.mutate,
    deleteTipologia: deleteTipologia.mutate,
    isCreating: createTipologia.isPending,
    isUpdating: updateTipologia.isPending,
    isDeleting: deleteTipologia.isPending,
  };
};
