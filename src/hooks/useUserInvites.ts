
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type UserInvite = {
  id: string;
  email: string;
  token: string;
  role: string;
  invited_by: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

export const useUserInvites = () => {
  const queryClient = useQueryClient();

  const { data: invites = [], isLoading, refetch } = useQuery({
    queryKey: ['user-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invites:', error);
        throw error;
      }
      
      return data as UserInvite[];
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: async (inviteData: {
      email: string;
      role: string;
    }) => {
      // Gerar token único
      const token = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('user_invites')
        .insert({
          email: inviteData.email,
          role: inviteData.role,
          token: token,
          invited_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-invites'] });
      toast({
        title: "Convite criado",
        description: "O convite foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar convite",
        description: error.message || "Ocorreu um erro ao criar o convite.",
        variant: "destructive",
      });
    },
  });

  const deleteInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-invites'] });
      toast({
        title: "Convite excluído",
        description: "O convite foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir convite",
        description: error.message || "Ocorreu um erro ao excluir o convite.",
        variant: "destructive",
      });
    },
  });

  return {
    invites,
    isLoading,
    createInvite: createInviteMutation.mutate,
    deleteInvite: deleteInviteMutation.mutate,
    isCreatingInvite: createInviteMutation.isPending,
    isDeletingInvite: deleteInviteMutation.isPending,
    refetch,
  };
};
