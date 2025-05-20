
import { QuestoesDiagnostico } from "@/types/diagnostico";

// Helper function to validate tipo_pontuacao
export const isValidTipoPontuacao = (value: string): value is 'Escala 1-5' | 'Sim/Não (1 ou 5)' => {
  return value === 'Escala 1-5' || value === 'Sim/Não (1 ou 5)';
};

// Helper function to validate exigencia fields
export const isValidExigencia = (value: string): value is 'X' | 'E' | 'N/A' => {
  return value === 'X' || value === 'E' || value === 'N/A';
};

// Helper function to convert raw data to the correct type
export const convertToQuestoesDiagnostico = (data: any): QuestoesDiagnostico => {
  return {
    ...data,
    tipo_pontuacao: isValidTipoPontuacao(data.tipo_pontuacao) ? data.tipo_pontuacao : 'Escala 1-5',
    exigencia_siac_nivel_b: isValidExigencia(data.exigencia_siac_nivel_b) ? data.exigencia_siac_nivel_b : 'N/A',
    exigencia_siac_nivel_a: isValidExigencia(data.exigencia_siac_nivel_a) ? data.exigencia_siac_nivel_a : 'N/A',
  };
};
