
import { QuestoesDiagnostico } from "@/types/diagnostico";

export interface GrupoQuestoes {
  requisito: string;
  titulo: string;
  questoes: QuestoesDiagnostico[];
}

/**
 * Agrupa questões de diagnóstico por requisito da norma
 * @param questoes Lista de todas as questões
 * @returns Lista de grupos de questões organizados por requisito
 */
export function agruparQuestoesPorRequisito(questoes: QuestoesDiagnostico[]): GrupoQuestoes[] {
  // Mapa para armazenar questões agrupadas por requisito
  const gruposMap = new Map<string, GrupoQuestoes>();
  
  // Ordena as questões pelo item do requisito para garantir ordem lógica
  const questoesOrdenadas = [...questoes].sort((a, b) => {
    return a.item_requisito.localeCompare(b.item_requisito);
  });
  
  questoesOrdenadas.forEach(questao => {
    // Extrai o requisito principal (exemplo: "4.1" de "4.1 - Requisitos gerais")
    const match = questao.item_requisito.match(/^(\d+\.\d+(?:\.\d+)?)/);
    const requisitoPrincipal = match ? match[1] : questao.item_requisito;
    
    // Extrai o título do requisito
    const tituloMatch = questao.item_requisito.match(/^[\d\.]+ - (.+)$/);
    const tituloRequisito = tituloMatch ? tituloMatch[1] : "Requisito";
    
    // Cria ou atualiza o grupo
    if (!gruposMap.has(requisitoPrincipal)) {
      gruposMap.set(requisitoPrincipal, {
        requisito: requisitoPrincipal,
        titulo: tituloRequisito,
        questoes: [questao]
      });
    } else {
      gruposMap.get(requisitoPrincipal)?.questoes.push(questao);
    }
  });
  
  // Converte o mapa em array e ordena por código do requisito
  return Array.from(gruposMap.values())
    .sort((a, b) => a.requisito.localeCompare(b.requisito));
}
