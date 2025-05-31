
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  telefone: string | null;
  crea: string | null;
  especialidade: string | null;
  is_engenheiro: boolean | null;
  role: string | null;
  status: string | null;
  created_at: string | null;
  invited_at: string | null;
  invited_by: string | null;
};

export const useSupabaseUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['supabase-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: async (inviteData: {
      email: string;
      role: string;
      first_name?: string;
      last_name?: string;
      telefone?: string;
      crea?: string;
      especialidade?: string;
      is_engenheiro?: boolean;
    }) => {
      const token = uuidv4();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não autenticado');

      // Criar convite na tabela user_invites
      const { error: inviteError } = await supabase
        .from('user_invites')
        .insert({
          email: inviteData.email,
          role: inviteData.role,
          invited_by: user.id,
          token
        });

      if (inviteError) throw inviteError;

      // Enviar email de convite através do Supabase Auth
      const { error: authError } = await supabase.auth.admin.inviteUserByEmail(
        inviteData.email,
        {
          data: {
            first_name: inviteData.first_name,
            last_name: inviteData.last_name,
            telefone: inviteData.telefone,
            crea: inviteData.crea,
            especialidade: inviteData.especialidade,
            is_engenheiro: inviteData.is_engenheiro,
            role: inviteData.role
          },
          redirectTo: `${window.location.origin}/accept-invite?token=${token}`
        }
      );

      if (authError) throw authError;

      return { token };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "Convite enviado",
        description: "O convite foi enviado por email com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao enviar convite:', error);
      toast({
        title: "Erro ao enviar convite",
        description: error.message || "Ocorreu um erro ao enviar o convite.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: {
      id: string;
      first_name?: string;
      last_name?: string;
      telefone?: string;
      crea?: string;
      especialidade?: string;
      is_engenheiro?: boolean;
      role?: string;
      status?: string;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "Usuário atualizado",
        description: "Os dados do usuário foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Primeiro deletar o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Depois deletar o usuário do auth (requer privilégios de admin)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoading,
    createInvite: createInviteMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreatingInvite: createInviteMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
};
