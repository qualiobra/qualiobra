
/**
 * Calcula o percentual de conformidade baseado nas respostas do diagnóstico
 * 
 * @param totalQuestoesAplicaveis Total de questões aplicáveis (excluindo "Não se Aplica")
 * @param atendeTotalmente Número de questões que atendem totalmente
 * @param atendeParcialmente Número de questões que atendem parcialmente
 * @returns Percentual de conformidade (0-100)
 */
export const calcularPercentualConformidade = (
  totalQuestoesAplicaveis: number,
  atendeTotalmente: number,
  atendeParcialmente: number
): number => {
  if (totalQuestoesAplicaveis === 0) return 0;
  
  // Atende parcialmente conta como 50% de conformidade
  const pontuacao = atendeTotalmente + (atendeParcialmente * 0.5);
  return (pontuacao / totalQuestoesAplicaveis) * 100;
};

/**
 * Interface para resposta do diagnóstico
 */
export interface RespostaDiagnostico {
  IDQuestaoRespondida: string;
  RespostaUsuario: string;
  JustificativaEvidencias: string;
}

/**
 * Interface para questão do diagnóstico
 */
export interface QuestaoDiagnostico {
  IDQuestao: string;
  DescricaoQuestao: string;
  CapituloRequisito: string;
  NivelAplicavel: string;
  OrdemExibicao: number;
  ExigenciaNivelA?: string;
  ExigenciaNivelB?: string;
}
