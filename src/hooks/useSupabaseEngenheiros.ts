
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SupabaseEngenheiro = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  crea: string | null;
  telefone: string | null;
  especialidade: string | null;
};

export const useSupabaseEngenheiros = () => {
  const { data: engenheiros = [], isLoading } = useQuery({
    queryKey: ['supabase-engenheiros'],
    queryFn: async () => {
      console.log('Fetching engineers from Supabase...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, crea, telefone, especialidade')
        .eq('is_engenheiro', true)
        .eq('status', 'active')
        .order('first_name');
      
      if (error) {
        console.error('Error fetching engineers:', error);
        throw error;
      }
      
      console.log('Engineers fetched:', data);
      return data as SupabaseEngenheiro[];
    },
  });

  return { engenheiros, isLoading };
};
