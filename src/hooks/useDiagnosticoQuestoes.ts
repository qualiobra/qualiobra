
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { QuestoesDiagnostico, NivelDiagnostico, DiagnosticoComResposta } from "@/types/diagnostico";
import { convertToQuestoesDiagnostico } from "@/utils/diagnosticoUtils";

export function useDiagnosticoQuestoes(nivelSelecionado: NivelDiagnostico, userId: string | undefined, isSignedIn: boolean) {
  const [questoes, setQuestoes] = useState<QuestoesDiagnostico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestoesDiagnostico = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Consulta para buscar todas as questões ativas
      const { data, error: fetchError } = await supabase
        .from("questoes_diagnostico")
        .select("*")
        .eq("ativa", true)
        .order('ordem_exibicao', { ascending: true });

      if (fetchError) {
        console.error("Erro ao buscar questões:", fetchError);
        throw new Error(`Erro ao buscar questões: ${fetchError.message}`);
      }
      
      if (!data || data.length === 0) {
        console.log("Nenhuma questão encontrada para o diagnóstico");
        setQuestoes([]);
      } else {
        console.log(`Encontradas ${data.length} questões para diagnóstico`);
        
        // Converter os dados brutos para o tipo correto
        const questoesConvertidas: QuestoesDiagnostico[] = data.map(convertToQuestoesDiagnostico);
        
        // Para diagnóstico, usamos todas as questões sem verificar respostas anteriores
        // isso evita erros de UUID inválido
        setQuestoes(questoesConvertidas);
      }
    } catch (err: any) {
      console.error("Erro ao carregar questões:", err);
      setError(err.message || "Não foi possível carregar as questões do diagnóstico.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar as questões do diagnóstico.",
        variant: "destructive",
      });
      setQuestoes([]);
    } finally {
      setIsLoading(false);
    }
  }, [nivelSelecionado]);

  return {
    questoes,
    isLoading,
    error,
    reloadQuestoes: fetchQuestoesDiagnostico,
    fetchQuestoesDiagnostico
  };
}

export default useDiagnosticoQuestoes;
