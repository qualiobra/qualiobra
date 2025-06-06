
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComodoMaster } from "@/types/comodoTypes";

export const useComodosManager = () => {
  const {
    data: comodosmaster = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comodos-master"],
    queryFn: async () => {
      console.log("Buscando cômodos master via RPC");
      
      const { data, error } = await supabase.rpc('get_comodos_master');
      
      if (error) {
        console.error("Erro ao buscar cômodos master:", error);
        throw error;
      }

      console.log("Cômodos master encontrados:", data);
      return data as ComodoMaster[];
    },
  });

  return {
    comodosmaster,
    isLoading,
    error,
  };
};
