
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ComodoFormData } from "@/components/admin/schemas/comodoFormSchema";
import { ComodoMaster } from "@/types/comodoTypes";

export const useComodosAdmin = () => {
  const queryClient = useQueryClient();

  // Buscar todos os cômodos usando RPC
  const {
    data: comodos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-master"],
    queryFn: async () => {
      console.log("Buscando cômodos master via RPC...");
      
      const { data, error } = await supabase.rpc('get_comodos_master');
      
      if (error) {
        console.error("Erro ao buscar cômodos:", error);
        throw error;
      }

      console.log("Cômodos encontrados:", data);
      return data as ComodoMaster[];
    },
  });

  // Criar novo cômodo usando RPC
  const createComodoMutation = useMutation({
    mutationFn: async (data: ComodoFormData) => {
      console.log("Criando cômodo via RPC:", data);
      
      const { data: result, error } = await supabase.rpc('create_comodo_master', {
        p_nome: data.nome,
        p_descricao: data.descricao || null,
        p_icone: data.icone
      });

      if (error) {
        console.error("Erro ao criar cômodo:", error);
        throw error;
      }

      console.log("Cômodo criado com ID:", result);
      return { id: result, ...data } as ComodoMaster;
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

  // Atualizar cômodo existente usando RPC
  const updateComodoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComodoFormData }) => {
      console.log("Atualizando cômodo via RPC:", id, data);
      
      const { data: result, error } = await supabase.rpc('update_comodo_master', {
        p_id: id,
        p_nome: data.nome,
        p_descricao: data.descricao || null,
        p_icone: data.icone
      });

      if (error) {
        console.error("Erro ao atualizar cômodo:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Cômodo não encontrado");
      }

      console.log("Cômodo atualizado com sucesso");
      return { id, ...data } as ComodoMaster;
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

  // Ativar/desativar cômodo usando RPC
  const toggleComodoStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      console.log("Alterando status do cômodo via RPC:", id, ativo);
      
      const { data: result, error } = await supabase.rpc('toggle_comodo_master', {
        p_id: id,
        p_ativo: ativo
      });

      if (error) {
        console.error("Erro ao alterar status do cômodo:", error);
        throw error;
      }

      if (!result) {
        throw new Error("Cômodo não encontrado");
      }

      console.log("Status do cômodo alterado com sucesso");
      return { id, ativo };
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
