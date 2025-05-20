
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { QuestoesDiagnostico } from "@/types/diagnostico";
import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

  const respondida = !!pontuacao;
  
  return (
    <AccordionItem key={questao.id_questao} value={questao.id_questao}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between w-full items-center pr-4">
          <span className="text-left">
            {questao.item_requisito}: {questao.titulo_requisito}
          </span>
          {respondida && (
            <span className="flex items-center text-green-600 text-sm ml-2">
              <Check className="h-4 w-4 mr-1" />
              {getPontuacaoLabel(pontuacao as number, questao.tipo_pontuacao)}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4">
          <p className="text-gray-700">{questao.descricao_questao}</p>
          
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
