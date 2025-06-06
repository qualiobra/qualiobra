
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ItemInspecionavel } from "@/types/itemTypes";

export const useItensAdmin = () => {
  const {
    data: itens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["itens-admin"],
    queryFn: async () => {
      console.log("Buscando itens inspectionáveis via RPC");
      
      const { data, error } = await supabase.rpc('get_itens_inspectionaveis');
      
      if (error) {
        console.error("Erro ao buscar itens:", error);
        throw error;
      }

      console.log("Itens encontrados:", data);
      return data as (ItemInspecionavel & { categoria_nome: string })[];
    },
  });

  return {
    itens,
    isLoading,
    error,
  };
};
