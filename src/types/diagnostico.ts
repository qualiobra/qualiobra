
export interface QuestoesDiagnostico {
  id_questao: string;
  referencial_normativo: string;
  item_requisito: string;
  titulo_requisito: string;
  descricao_questao: string;
  tipo_pontuacao: 'Escala 1-5' | 'Sim/Não (1 ou 5)';
  ordem_exibicao: number;
  exigencia_siac_nivel_b: 'X' | 'E' | 'N/A';
  exigencia_siac_nivel_a: 'X' | 'E' | 'N/A';
  referencia_completa_siac?: string;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export interface RespostaDiagnostico {
  id_resposta?: string;
  id_questao: string;
  id_obra: string;
  id_usuario: string;
  pontuacao: number;
  observacao?: string;
  evidencia?: string;
  data_resposta: string;
}

export interface DiagnosticoComResposta extends QuestoesDiagnostico {
  resposta?: RespostaDiagnostico;
}

// Simplificado para apenas um tipo de nível
export type NivelDiagnostico = 'Geral';

export interface ResultadoDiagnostico {
  pontuacaoTotal: number;
  quantidadeQuestoes: number;
  pontuacaoMedia: number;
  percentualConformidade: number;
  questoesComResposta: number;
  questoesPendentes: number;
}
