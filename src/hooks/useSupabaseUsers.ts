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
      console.log('=== FETCHING USERS FROM DATABASE ===');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched from database:', data?.length || 0, 'users');
      console.log('User list:', data?.map(u => `${u.first_name} ${u.last_name} (${u.email})`));
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
      console.log('=== INICIANDO CRIAÇÃO DE USUÁRIO ===');
      console.log('Dados do usuário:', userData);
      
      try {
        // 1. Verificar se o email já existe na tabela profiles
        console.log('1. Verificando se email já existe na tabela profiles...');
        const { data: existingProfiles, error: checkProfileError } = await supabase
          .from('profiles')
          .select('email, id')
          .eq('email', userData.email);
        
        if (checkProfileError) {
          console.error('Erro ao verificar profiles existentes:', checkProfileError);
          throw new Error(`Erro ao verificar email: ${checkProfileError.message}`);
        }
        
        if (existingProfiles && existingProfiles.length > 0) {
          const existingProfile = existingProfiles[0];
          console.error('Email já existe na tabela profiles:', existingProfile);
          throw new Error('Este email já está cadastrado no sistema');
        }
        
        console.log('1a. Email não existe na tabela profiles, prosseguindo...');
        
        // 2. Verificar se o email já existe no Auth
        console.log('2. Verificando usuários no Auth via admin...');
        try {
          const { data: authUsersResponse, error: authListError } = await supabase.auth.admin.listUsers();
          if (authListError) {
            console.warn('Não foi possível listar usuários do Auth:', authListError);
          } else if (authUsersResponse?.users) {
            const existingAuthUser = authUsersResponse.users.find(u => u.email === userData.email);
            if (existingAuthUser) {
              console.error('Email já existe no Auth:', existingAuthUser.email);
              throw new Error('Este email já está cadastrado no sistema de autenticação');
            }
            console.log('2a. Email não existe no Auth, prosseguindo...');
          }
        } catch (authError) {
          console.warn('Erro ao verificar Auth (continuando):', authError);
        }
        
        // 3. Gerar senha forte
        const tempPassword = generateStrongPassword();
        console.log('3. Senha temporária gerada (primeiros 3 chars):', tempPassword.substring(0, 3) + '***');
        
        // 4. Preparar metadados do usuário
        const userMetadata = {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          telefone: userData.telefone || '',
          crea: userData.crea || '',
          especialidade: userData.especialidade || '',
          is_engenheiro: userData.is_engenheiro || false,
          role: userData.role || 'user'
        };
        
        console.log('4. Metadados preparados:', userMetadata);
        
        // 5. Criar usuário no Supabase Auth
        console.log('5. Criando usuário no Supabase Auth...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: tempPassword,
          options: {
            data: userMetadata,
            emailRedirectTo: undefined // Desabilitar redirecionamento
          }
        });
        
        console.log('5a. Resposta do signUp:', {
          user: authData.user ? 'Criado' : 'Não criado',
          userId: authData.user?.id,
          userEmail: authData.user?.email,
          session: authData.session ? 'Existe' : 'Não existe',
          error: authError
        });
        
        if (authError) {
          console.error('=== ERRO NO SUPABASE AUTH ===');
          console.error('Erro completo:', authError);
          
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
          console.error('Usuário não foi criado no Auth');
          throw new Error('Falha na criação do usuário. Verifique as configurações de autenticação.');
        }
        
        console.log('6. Usuário criado com sucesso no Auth, ID:', authData.user.id);
        
        // 6. Aguardar e verificar se o perfil foi criado via trigger
        console.log('7. Aguardando criação do perfil via trigger...');
        
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 15; // Aumentar tentativas
        
        while (!profileCreated && attempts < maxAttempts) {
          attempts++;
          console.log(`7.${attempts}. Tentativa ${attempts}/${maxAttempts} - Verificando perfil...`);
          
          await new Promise(resolve => setTimeout(resolve, 1500)); // Aguardar 1.5 segundos
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (profileError) {
            if (profileError.code !== 'PGRST116') { // PGRST116 = não encontrado
              console.error('Erro inesperado ao verificar perfil:', profileError);
            } else {
              console.log(`7.${attempts}a. Perfil ainda não encontrado...`);
            }
          } else if (profileData) {
            console.log(`7.${attempts}b. ✅ PERFIL ENCONTRADO:`, profileData);
            profileCreated = true;
            
            // Forçar refresh da query imediatamente
            console.log(`7.${attempts}c. Forçando refresh da lista de usuários...`);
            await queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
            await queryClient.refetchQueries({ queryKey: ['supabase-users'] });
          }
        }
        
        if (!profileCreated) {
          console.error('=== PERFIL NÃO FOI CRIADO APÓS MÚLTIPLAS TENTATIVAS ===');
          console.error('Tentando criar perfil manualmente...');
          
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
            console.error('Erro ao criar perfil manualmente:', manualError);
            throw new Error(`Usuário criado mas perfil falhou: ${manualError.message}`);
          } else {
            console.log('✅ Perfil criado manualmente com sucesso:', manualProfile);
            profileCreated = true;
          }
        }
        
        console.log('=== USUÁRIO CRIADO COM SUCESSO ===');
        console.log('Forçando refresh final das queries...');
        
        // Refresh múltiplo para garantir
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
        console.error('=== ERRO GERAL NA CRIAÇÃO ===');
        console.error('Erro capturado:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('=== SUCESSO NA MUTAÇÃO ===');
      console.log('Resultado completo:', result);
      
      // Forçar refresh das queries múltiplas vezes
      const forceRefresh = async () => {
        console.log('Invalidando e refazendo todas as queries relacionadas...');
        await queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
        await queryClient.invalidateQueries({ queryKey: ['supabase-engenheiros'] });
        await queryClient.refetchQueries({ queryKey: ['supabase-users'] });
        await refetch();
        
        // Verificar se o usuário aparece na lista após refresh
        setTimeout(async () => {
          const currentUsers = queryClient.getQueryData(['supabase-users']) as Profile[] || [];
          const createdUser = currentUsers.find(u => u.id === result.userId);
          console.log('Usuário criado encontrado na lista após refresh:', createdUser ? 'SIM' : 'NÃO');
          if (createdUser) {
            console.log('Dados do usuário criado:', createdUser);
          } else {
            console.error('⚠️ USUÁRIO NÃO APARECE NA LISTA APÓS CRIAÇÃO!');
            // Tentar refresh adicional
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
      console.error('=== ERRO NA MUTAÇÃO ===');
      console.error('Erro capturado:', error);
      
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
      console.log('Updating user with data:', userData);
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
      console.log('Deleting user:', userId);
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
    refetch, // Expor a função refetch
  };
};
