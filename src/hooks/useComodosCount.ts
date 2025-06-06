
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useComodosCount = (tipologiaId: string) => {
  return useQuery({
    queryKey: ['comodos-count', tipologiaId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('comodos_tipologia')
        .select('*', { count: 'exact', head: true })
        .eq('tipologia_id', tipologiaId);
      
      if (error) {
        console.error('Error fetching comodos count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!tipologiaId,
  });
};
