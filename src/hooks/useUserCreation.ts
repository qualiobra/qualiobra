
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateStrongPassword } from "@/utils/passwordGenerator";

interface CreateUserData {
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  telefone?: string;
  crea?: string;
  especialidade?: string;
  is_engenheiro?: boolean;
}

export const useUserCreation = (refetch: () => Promise<any>) => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
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
          const currentUsers = queryClient.getQueryData(['supabase-users']) as any[] || [];
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

  return {
    createUser: createUserMutation.mutate,
    isCreatingUser: createUserMutation.isPending,
  };
};
