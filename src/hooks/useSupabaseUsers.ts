
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCreation } from "./useUserCreation";
import { useUserMutations } from "./useUserMutations";

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

  const { createUser, isCreatingUser } = useUserCreation(refetch);
  const { updateUser, deleteUser, isUpdatingUser, isDeletingUser } = useUserMutations();

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    isCreatingUser,
    isUpdatingUser,
    isDeletingUser,
    refetch,
  };
};
