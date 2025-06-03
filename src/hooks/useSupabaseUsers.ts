import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
      console.log('Fetching users from profiles table...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched:', data);
      return data as Profile[];
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      role: string;
      first_name?: string;
      last_name?: string;
      telefone?: string;
      crea?: string;
      especialidade?: string;
      is_engenheiro?: boolean;
    }) => {
      console.log('Creating user with data:', userData);
      
      // Criar usuário diretamente no Supabase Auth com senha temporária
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      // Preparar os metadata do usuário
      const userMetadata = {
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        telefone: userData.telefone || '',
        crea: userData.crea || '',
        especialidade: userData.especialidade || '',
        is_engenheiro: userData.is_engenheiro || false,
        role: userData.role || 'user'
      };

      console.log('User metadata being sent:', userMetadata);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: tempPassword,
        options: {
          data: userMetadata
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData);
      
      // Aguardar um pouco para garantir que o trigger foi executado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return authData;
    },
    onSuccess: () => {
      // Invalidar e refetch os dados dos usuários
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      queryClient.invalidateQueries({ queryKey: ['supabase-engenheiros'] });
      
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso e aparecerá na lista em instantes.",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro ao criar o usuário.",
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
      queryClient.invalidateQueries({ queryKey: ['supabase-engenheiros'] });
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

      // Depois deletar o usuário do auth (pode falhar se não tiver privilégios)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn('Could not delete user from auth:', authError);
        }
      } catch (err) {
        console.warn('Auth deletion not available:', err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      queryClient.invalidateQueries({ queryKey: ['supabase-engenheiros'] });
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
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreatingUser: createUserMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
};
