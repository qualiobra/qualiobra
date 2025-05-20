
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { QuestoesDiagnostico } from "@/types/diagnostico";
import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import DiagnosticoEscalaPontuacao from "./DiagnosticoEscalaPontuacao";

interface DiagnosticoQuestaoItemProps {
  questao: QuestoesDiagnostico;
  pontuacao?: number;
  observacao?: string;
  onPontuacaoChange: (idQuestao: string, pontuacao: number) => void;
  onObservacaoChange: (idQuestao: string, observacao: string) => void;
}

const DiagnosticoQuestaoItem = ({
  questao,
  pontuacao,
  observacao = "",
  onPontuacaoChange,
  onObservacaoChange
}: DiagnosticoQuestaoItemProps) => {
  
  const getPontuacaoLabel = (pontuacao: number, tipoPontuacao: string) => {
    if (tipoPontuacao === "Sim/Não (1 ou 5)") {
      return pontuacao === 1 ? "Não" : pontuacao === 5 ? "Sim" : "Não respondida";
    } else {
      switch (pontuacao) {
        case 1: return "Não implementado (1)";
        case 2: return "Parcialmente implementado (2)";
        case 3: return "Implementado, mas não documentado (3)";
        case 4: return "Implementado e documentado (4)";
        case 5: return "Implementado, documentado e melhorado (5)";
        default: return "Não respondida";
      }
    }
  };

  const getExigenciaBadge = (tipo: 'X' | 'E' | 'N/A', nivel: string) => {
    if (tipo === 'N/A') return null;
    
    let colorClass = '';
    let textColor = '';
    
    if (nivel === 'Nível B') {
      colorClass = tipo === 'X' ? 'bg-blue-600' : 'border-blue-600 text-blue-600';
    } else {
      colorClass = tipo === 'X' ? 'bg-green-600' : 'border-green-600 text-green-600';
    }
    
    return (
      <Badge 
        variant={tipo === 'X' ? "default" : "outline"} 
        className={`ml-2 ${colorClass}`}
      >
        {tipo === 'X' ? `${nivel} (X)` : `${nivel} (E)`}
      </Badge>
    );
  };

  const respondida = !!pontuacao;
  
  return (
    <AccordionItem key={questao.id_questao} value={questao.id_questao}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between w-full items-center pr-4">
          <div className="flex flex-wrap items-center">
            <span className="text-left mr-2">
              {questao.item_requisito}: {questao.titulo_requisito}
            </span>
            <div className="flex mt-1">
              {questao.exigencia_siac_nivel_b !== 'N/A' && getExigenciaBadge(questao.exigencia_siac_nivel_b, 'Nível B')}
              {questao.exigencia_siac_nivel_a !== 'N/A' && getExigenciaBadge(questao.exigencia_siac_nivel_a, 'Nível A')}
            </div>
          </div>
          {respondida && (
            <span className="flex items-center text-green-600 text-sm ml-2 shrink-0">
              <Check className="h-4 w-4 mr-1" />
              {getPontuacaoLabel(pontuacao as number, questao.tipo_pontuacao)}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4">
          <p className="text-gray-700">{questao.descricao_questao}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {questao.exigencia_siac_nivel_b !== 'N/A' && (
              <div className="text-sm bg-blue-50 p-2 rounded border border-blue-200">
                <span className="font-medium text-blue-800">Nível B:</span> {questao.exigencia_siac_nivel_b === 'X' ? 'Requisito' : 'Evidência'}
              </div>
            )}
            {questao.exigencia_siac_nivel_a !== 'N/A' && (
              <div className="text-sm bg-green-50 p-2 rounded border border-green-200">
                <span className="font-medium text-green-800">Nível A:</span> {questao.exigencia_siac_nivel_a === 'X' ? 'Requisito' : 'Evidência'}
              </div>
            )}
          </div>
          
          {questao.referencia_completa_siac && (
            <div className="mt-2 text-sm text-gray-500">
              <strong>Referência SiAC:</strong> {questao.referencia_completa_siac}
            </div>
          )}
          
          <div className="mt-4">
            <Label>Avaliação</Label>
            <DiagnosticoEscalaPontuacao
              idQuestao={questao.id_questao}
              tipoPontuacao={questao.tipo_pontuacao}
              valorAtual={pontuacao?.toString() || ""}
              onChange={(valor) => onPontuacaoChange(questao.id_questao, valor)}
            />
          </div>
          
          <div className="mt-4">
            <Label htmlFor={`obs-${questao.id_questao}`}>Observações e evidências</Label>
            <Textarea 
              id={`obs-${questao.id_questao}`}
              placeholder="Descreva as evidências encontradas ou anote observações relevantes"
              value={observacao}
              onChange={(e) => onObservacaoChange(questao.id_questao, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DiagnosticoQuestaoItem;
