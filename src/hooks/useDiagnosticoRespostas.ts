
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NivelDiagnostico } from "@/types/diagnostico";

interface RespostaDiagnostico {
  pontuacao: number;
  observacao: string;
}

export function useDiagnosticoRespostas(totalQuestoes: number, nivel: NivelDiagnostico) {
  const [respostas, setRespostas] = useState<Record<string, RespostaDiagnostico>>({});
  const [progresso, setProgresso] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosticoId] = useState(() => uuidv4());

  const handleRespostaChange = (idQuestao: string, pontuacao: number) => {
    setRespostas(prev => {
      const novasRespostas = {
        ...prev,
        [idQuestao]: { 
          pontuacao, 
          observacao: prev[idQuestao]?.observacao || "" 
        }
      };
      
      // Atualizar progresso
      const totalRespondidas = Object.keys(novasRespostas).length;
      const novoProgresso = totalQuestoes > 0 ? Math.round((totalRespondidas / totalQuestoes) * 100) : 0;
      setProgresso(novoProgresso);
      
      return novasRespostas;
    });
  };

  const handleObservacaoChange = (idQuestao: string, observacao: string) => {
    setRespostas(prev => ({
      ...prev,
      [idQuestao]: { 
        pontuacao: prev[idQuestao]?.pontuacao || 0, 
        observacao 
      }
    }));
  };

  const salvarRespostas = async (userId: string) => {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar respostas.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Preparar os dados para inserção
      const respostasArray = Object.entries(respostas).map(([id_questao, { pontuacao, observacao }]) => ({
        id_resposta_diagnostico: uuidv4(),
        id_usuario_avaliador: userId,
        id_questao_respondida: id_questao,
        nivel_diagnostico_realizado: nivel,
        pontuacao_usuario: pontuacao,
        observacoes_usuario: observacao || null,
        data_hora_resposta: new Date().toISOString(),
        id_diagnostico_agrupador: diagnosticoId,
      }));
      
      // Inserir respostas no banco de dados
      const { error } = await supabase
        .from('respostas_diagnostico_usuario')
        .insert(respostasArray);
      
      if (error) {
        console.error("Erro ao salvar respostas:", error);
        throw error;
      }
      
      toast({
        title: "Respostas salvas",
        description: "Suas respostas foram salvas com sucesso.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Erro ao salvar respostas:", error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao salvar suas respostas: ${error.message || "Erro desconhecido"}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { 
    respostas, 
    progresso,
    isSaving, 
    totalRespondidas: Object.keys(respostas).length,
    handleRespostaChange, 
    handleObservacaoChange, 
    salvarRespostas 
  };
}

export default useDiagnosticoRespostas;
