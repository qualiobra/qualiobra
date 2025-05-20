
export interface QuestoesDiagnostico {
  id_questao: string;
  referencial_normativo: string;
  nivel_aplicavel: 'Nível B' | 'Nível A' | 'Ambos os Níveis';
  item_requisito: string;
  titulo_requisito: string;
  descricao_questao: string;
  tipo_pontuacao: 'Escala 1-5' | 'Sim/Não (1 ou 5)';
  ordem_exibicao: number;
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

export type NivelDiagnostico = 'Nível B' | 'Nível A' | 'Ambos os Níveis';

export interface ResultadoDiagnostico {
  pontuacaoTotal: number;
  quantidadeQuestoes: number;
  pontuacaoMedia: number;
  percentualConformidade: number;
  questoesComResposta: number;
  questoesPendentes: number;
}
