
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
        
        // Buscamos as respostas do usuário atual apenas se ele estiver autenticado
        if (userId && isSignedIn && questoesConvertidas.length > 0) {
          try {
            const { data: respostas, error: respostasError } = await supabase
              .from('respostas_diagnostico_usuario')
              .select('*')
              .eq('id_usuario_avaliador', userId)
              .eq('nivel_diagnostico_realizado', nivelSelecionado);
              
            if (respostasError) {
              console.warn("Erro ao buscar respostas do usuário:", respostasError);
              // Continuamos mesmo se houver erro nas respostas
            }
            
            if (respostas && respostas.length > 0) {
              // Mapeamos as respostas para as questões
              const questoesComRespostas = questoesConvertidas.map(questao => {
                const resposta = respostas.find(r => r.id_questao_respondida === questao.id_questao);
                return resposta ? { ...questao, resposta } : questao;
              });
              setQuestoes(questoesComRespostas);
            } else {
              setQuestoes(questoesConvertidas);
            }
          } catch (respostasErr) {
            console.error("Erro ao processar respostas:", respostasErr);
            setQuestoes(questoesConvertidas);
          }
        } else {
          // Se não estiver autenticado, apenas definimos as questões
          setQuestoes(questoesConvertidas);
        }
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
  }, [nivelSelecionado, userId, isSignedIn]);

  return {
    questoes,
    isLoading,
    error,
    reloadQuestoes: fetchQuestoesDiagnostico,
    fetchQuestoesDiagnostico
  };
}

export default useDiagnosticoQuestoes;
