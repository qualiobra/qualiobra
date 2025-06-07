
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/SupabaseAuthContext";

export const useRoleAssignmentMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const assignRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { data, error } = await supabase
        .from('user_role_assignments')
        .insert({
          user_id: userId,
          role_id: roleId,
          assigned_by: user?.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-role-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Role atribuído",
        description: "O role foi atribuído com sucesso ao usuário.",
      });
    },
    onError: (error) => {
      console.error('Error in assignRole:', error);
      toast({
        title: "Erro ao atribuir role",
        description: "Não foi possível atribuir o role ao usuário.",
        variant: "destructive",
      });
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { error } = await supabase
        .from('user_role_assignments')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        console.error('Error removing role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-role-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Role removido",
        description: "O role foi removido com sucesso do usuário.",
      });
    },
    onError: (error) => {
      console.error('Error in removeRole:', error);
      toast({
        title: "Erro ao remover role",
        description: "Não foi possível remover o role do usuário.",
        variant: "destructive",
      });
    },
  });

  return {
    assignRole,
    removeRole,
    isAssigning: assignRole.isPending,
    isRemoving: removeRole.isPending,
  };
};
