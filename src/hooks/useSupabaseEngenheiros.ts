
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SupabaseEngenheiro = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  crea: string | null;
  telefone: string | null;
  especialidade: string | null;
  email: string | null;
};

export const useSupabaseEngenheiros = () => {
  const { data: engenheiros = [], isLoading } = useQuery({
    queryKey: ['supabase-engenheiros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, crea, telefone, especialidade, email')
        .eq('is_engenheiro', true)
        .eq('status', 'active')
        .order('first_name');
      
      if (error) throw error;
      return data as SupabaseEngenheiro[];
    },
  });

  return { engenheiros, isLoading };
};
