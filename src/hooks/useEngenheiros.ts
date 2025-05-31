
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Engenheiro = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  crea: string | null;
  telefone: string | null;
  especialidade: string | null;
};

export const useEngenheiros = () => {
  const { data: engenheiros = [], isLoading } = useQuery({
    queryKey: ['engenheiros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, crea, telefone, especialidade')
        .eq('is_engenheiro', true)
        .order('first_name');
      
      if (error) throw error;
      return data as Engenheiro[];
    },
  });

  return { engenheiros, isLoading };
};
