
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoFormData } from "@/components/admin/schemas/comodoFormSchema";
import { ComodoMaster, ComodoMasterInsert, ComodoMasterUpdate } from "@/types/comodoTypes";

export const useComodosAdmin = () => {
  const queryClient = useQueryClient();

  // Buscar todos os cômodos
  const {
    data: comodos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-master"],
    queryFn: async () => {
      console.log("Buscando cômodos master...");
      
      // Usar query SQL direta para acessar a tabela comodos_master
      const { data, error } = await supabase.rpc('get_comodos_master');
      
      if (error) {
        // Fallback: tentar query SQL direta se a RPC não existir
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('comodos_master' as any)
          .select('*')
          .order('nome');
          
        if (fallbackError) {
          console.error("Erro ao buscar cômodos:", fallbackError);
          throw fallbackError;
        }
        
        console.log("Cômodos encontrados (fallback):", fallbackData);
        return fallbackData as ComodoMaster[];
      }

      console.log("Cômodos encontrados:", data);
      return data as ComodoMaster[];
    },
  });

  // Criar novo cômodo
  const createComodoMutation = useMutation({
    mutationFn: async (data: ComodoFormData) => {
      console.log("Criando cômodo:", data);
      
      const insertData: ComodoMasterInsert = {
        nome: data.nome,
        descricao: data.descricao || null,
        icone: data.icone,
        ativo: true
      };

      const { data: result, error } = await supabase
        .from('comodos_master' as any)
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar cômodo:", error);
        throw error;
      }

      return result as ComodoMaster;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master"] });
      toast({
        title: "Sucesso",
        description: "Cômodo criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de criação:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Atualizar cômodo existente
  const updateComodoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComodoFormData }) => {
      console.log("Atualizando cômodo:", id, data);
      
      const updateData: ComodoMasterUpdate = {
        nome: data.nome,
        descricao: data.descricao || null,
        icone: data.icone
      };

      const { data: result, error } = await supabase
        .from('comodos_master' as any)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar cômodo:", error);
        throw error;
      }

      return result as ComodoMaster;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master"] });
      toast({
        title: "Sucesso",
        description: "Cômodo atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de atualização:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Ativar/desativar cômodo (soft delete)
  const toggleComodoStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      console.log("Alterando status do cômodo:", id, ativo);
      
      const { data: result, error } = await supabase
        .from('comodos_master' as any)
        .update({ ativo })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao alterar status do cômodo:", error);
        throw error;
      }

      return result as ComodoMaster;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comodos-master"] });
      toast({
        title: "Sucesso",
        description: `Cômodo ${variables.ativo ? "ativado" : "desativado"} com sucesso!`,
      });
    },
    onError: (error) => {
      console.error("Erro na mutação de status:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do cômodo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    comodos,
    isLoading,
    error,
    createComodo: createComodoMutation.mutate,
    updateComodo: updateComodoMutation.mutate,
    toggleComodoStatus: toggleComodoStatusMutation.mutate,
    isCreating: createComodoMutation.isPending,
    isUpdating: updateComodoMutation.isPending,
    isTogglingStatus: toggleComodoStatusMutation.isPending,
  };
};
