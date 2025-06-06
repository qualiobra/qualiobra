
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

// Função para gerar senha mais robusta
const generateStrongPassword = () => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export const useSupabaseUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['supabase-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
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
      try {
        // Verificar se o email já existe na tabela profiles
        const { data: existingProfiles, error: checkProfileError } = await supabase
          .from('profiles')
          .select('email, id')
          .eq('email', userData.email);
        
        if (checkProfileError) {
          throw new Error(`Erro ao verificar email: ${checkProfileError.message}`);
        }
        
        if (existingProfiles && existingProfiles.length > 0) {
          throw new Error('Este email já está cadastrado no sistema');
        }
        
        // Gerar senha forte
        const tempPassword = generateStrongPassword();
        
        // Preparar metadados do usuário
        const userMetadata = {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          telefone: userData.telefone || '',
          crea: userData.crea || '',
          especialidade: userData.especialidade || '',
          is_engenheiro: userData.is_engenheiro || false,
          role: userData.role || 'user'
        };
        
        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: tempPassword,
          options: {
            data: userMetadata,
            emailRedirectTo: undefined
          }
        });
        
        if (authError) {
          let errorMessage = authError.message;
          if (authError.message.includes('Email rate limit exceeded')) {
            errorMessage = 'Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.';
          } else if (authError.message.includes('User already registered')) {
            errorMessage = 'Este email já está cadastrado no sistema.';
          } else if (authError.message.includes('Invalid email')) {
            errorMessage = 'Email inválido.';
          } else if (authError.message.includes('Signup is disabled')) {
            errorMessage = 'Cadastro está desabilitado. Verifique as configurações do Supabase.';
          }
          
          throw new Error(errorMessage);
        }
        
        if (!authData.user) {
          throw new Error('Falha na criação do usuário. Verifique as configurações de autenticação.');
        }
        
        // Aguardar criação do perfil via trigger
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 15;
        
        while (!profileCreated && attempts < maxAttempts) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (profileData) {
            profileCreated = true;
            await queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
            await queryClient.refetchQueries({ queryKey: ['supabase-users'] });
          }
        }
        
        if (!profileCreated) {
          const { data: manualProfile, error: manualError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              first_name: userMetadata.first_name,
              last_name: userMetadata.last_name,
              email: userData.email,
              telefone: userMetadata.telefone,
              crea: userMetadata.crea,
              especialidade: userMetadata.especialidade,
              is_engenheiro: userMetadata.is_engenheiro,
              role: userMetadata.role,
              status: 'active'
            })
            .select()
            .single();
          
          if (manualError) {
            throw new Error(`Usuário criado mas perfil falhou: ${manualError.message}`);
          } else {
            profileCreated = true;
          }
        }
        
        setTimeout(async () => {
          await queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
          await queryClient.invalidateQueries({ queryKey: ['supabase-engenheiros'] });
          await refetch();
        }, 500);
        
        return {
          authData,
          profileCreated: true,
          attempts,
          userId: authData.user.id
        };
        
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (result) => {
      const forceRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
        await queryClient.invalidateQueries({ queryKey: ['supabase-engenheiros'] });
        await queryClient.refetchQueries({ queryKey: ['supabase-users'] });
        await refetch();
        
        setTimeout(async () => {
          const currentUsers = queryClient.getQueryData(['supabase-users']) as Profile[] || [];
          const createdUser = currentUsers.find(u => u.id === result.userId);
          if (!createdUser) {
            await refetch();
          }
        }, 2000);
      };
      
      forceRefresh();
      
      toast({
        title: "Usuário criado com sucesso!",
        description: `O usuário foi criado e deve aparecer na lista. Tentativas: ${result.attempts}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado ao criar o usuário.",
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
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

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
    refetch,
  };
};
