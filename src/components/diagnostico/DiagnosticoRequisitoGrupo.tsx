
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GrupoQuestoes } from "@/utils/diagnosticoGroupUtils";
import DiagnosticoQuestaoItem from "./DiagnosticoQuestaoItem";

interface DiagnosticoRequisitoGrupoProps {
  grupo: GrupoQuestoes;
  respostas: Record<string, { pontuacao: number; observacao: string }>;
  onPontuacaoChange: (idQuestao: string, pontuacao: number) => void;
  onObservacaoChange: (idQuestao: string, observacao: string) => void;
}

const DiagnosticoRequisitoGrupo = ({
  grupo,
  respostas,
  onPontuacaoChange,
  onObservacaoChange
}: DiagnosticoRequisitoGrupoProps) => {
  const totalQuestoes = grupo.questoes.length;
  const questoesRespondidas = grupo.questoes.filter(q => 
    respostas[q.id_questao]?.pontuacao !== undefined
  ).length;
  
  const progressoGrupo = totalQuestoes > 0 
    ? Math.round((questoesRespondidas / totalQuestoes) * 100) 
    : 0;
  
  return (
    <AccordionItem value={grupo.requisito} className="border rounded-lg mb-4 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gray-50">
        <div className="flex flex-col w-full text-left">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-lg">
                {grupo.requisito} - {grupo.titulo}
              </span>
              <span className="ml-3 text-sm text-gray-600">
                ({questoesRespondidas}/{totalQuestoes} respondidas)
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {progressoGrupo}%
            </span>
          </div>
          <Progress value={progressoGrupo} className="h-2 mt-2" />
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        <Card className="border-0 shadow-none">
          <CardContent className="p-2">
            {grupo.questoes.map((questao) => (
              <DiagnosticoQuestaoItem
                key={questao.id_questao}
                questao={questao}
                pontuacao={respostas[questao.id_questao]?.pontuacao}
                observacao={respostas[questao.id_questao]?.observacao}
                onPontuacaoChange={onPontuacaoChange}
                onObservacaoChange={onObservacaoChange}
              />
            ))}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DiagnosticoRequisitoGrupo;
