
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTipologiasCount = (obraId: string) => {
  return useQuery({
    queryKey: ['tipologias-count', obraId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tipologias')
        .select('*', { count: 'exact', head: true })
        .eq('obra_id', obraId);
      
      if (error) {
        console.error('Error fetching tipologias count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!obraId,
  });
};
