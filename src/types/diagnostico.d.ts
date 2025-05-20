
// Type definitions for the DiagnosticoInicialConformidade feature

export type NivelPBQPH = "Nível A" | "Nível B" | "Não Aplicável";

// Tipos para QuestoesDiagnostico
export type NivelAplicavel = "Nível B" | "Nível A" | "Ambos os Níveis";

export type QuestaoDiagnostico = {
  IDQuestao: string; // UUID
  ReferencialNormativo: string;
  NivelAplicavel: NivelAplicavel;
  CapituloRequisito: string;
  SubItemRequisito?: string; // Optional
  DescricaoQuestao: string;
  ExigenciaNivelB?: string; // Optional
  ExigenciaNivelA?: string; // Optional
  OrdemExibicao: number;
  GrupoQuestao?: string; // Optional
  Ativa: boolean;
};

// Tipos para RespostasDiagnosticoUsuario
export type RespostaOpcao = "Atende Totalmente" | "Atende Parcialmente" | "Não Atende" | "Não se Aplica";

export type RespostaDiagnostico = {
  IDRespostaDiagnostico: string; // UUID
  IDUsuarioAvaliador: string;
  IDObraAvaliada?: string; // Optional
  IDQuestaoRespondida: string;
  NivelDiagnosticoRealizado: "Nível B" | "Nível A";
  RespostaUsuario: RespostaOpcao;
  JustificativaEvidencias?: string; // Optional
  DataHoraResposta: string; // ISO date string
  IDDiagnosticoAgrupador: string; // UUID for grouping responses from the same diagnostic session
};

// Tipo para representar um diagnóstico completo
export type DiagnosticoCompleto = {
  IDDiagnostico: string;
  DataRealizacao: string;
  NivelRealizado: "Nível A" | "Nível B";
  IDObraAvaliada?: string;
  IDUsuarioAvaliador: string;
  NomeUsuarioAvaliador: string;
  TotalQuestoes: number;
  QuestoesAtendemTotalmente: number;
  QuestoesAtendemParcialmente: number;
  QuestoesNaoAtendem: number;
  QuestoesNaoAplicaveis: number;
  PercentualConformidade: number;
  Status: "Em Andamento" | "Concluído";
  RespostasDiagnostico: RespostaDiagnostico[];
};

// Helper para calcular percentual de conformidade
export function calcularPercentualConformidade(
  totalQuestoes: number,
  atendemTotalmente: number,
  atendemParcialmente: number
): number {
  if (totalQuestoes === 0) return 0;
  
  // Para percentual de conformidade, consideramos:
  // - Atende Totalmente: 100% do valor da questão
  // - Atende Parcialmente: 50% do valor da questão
  // - Não Atende ou Não Aplicável: 0% do valor da questão
  
  const pontuacao = atendemTotalmente + (atendemParcialmente * 0.5);
  return (pontuacao / totalQuestoes) * 100;
}
