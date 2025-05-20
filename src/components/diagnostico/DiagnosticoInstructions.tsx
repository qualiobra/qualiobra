
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Info, HelpCircle } from "lucide-react";

const DiagnosticoInstructions = () => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Objetivo do Diagnóstico</AlertTitle>
        <AlertDescription>
          Este diagnóstico tem como objetivo realizar uma autoavaliação inicial da empresa 
          para verificar o grau de atendimento aos requisitos da norma PBQP-H SiAC em seus 
          diferentes níveis (A e B).
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Como responder o diagnóstico:</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Selecione o nível a ser avaliado</p>
                <p className="text-gray-600">Escolha entre os níveis A ou B de acordo com o objetivo da sua empresa.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Responda às questões com sinceridade</p>
                <p className="text-gray-600">
                  A avaliação só será útil se refletir a realidade atual da empresa.
                  Não há problema em identificar não conformidades nesta fase inicial.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Utilize a escala de pontuação adequadamente</p>
                <p className="text-gray-600">Alguns itens utilizam escala de 1 a 5, outros apenas Sim/Não:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                  <li><strong>1 - Não implementado:</strong> Não há evidências de atendimento ao requisito</li>
                  <li><strong>2 - Parcialmente implementado:</strong> Há alguma evidência, mas não é consistente</li>
                  <li><strong>3 - Implementado, não documentado:</strong> Há evidências práticas, mas sem documentação</li>
                  <li><strong>4 - Implementado e documentado:</strong> Requisito atendido com documentação</li>
                  <li><strong>5 - Implementado, documentado e melhorado:</strong> Além de atendido, há melhorias</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Adicione observações e evidências</p>
                <p className="text-gray-600">
                  Para cada resposta, inclua observações sobre as evidências encontradas ou 
                  justificativas para a pontuação atribuída.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Salve suas respostas regularmente</p>
                <p className="text-gray-600">
                  Você pode interromper o diagnóstico e continuar posteriormente, 
                  desde que salve suas respostas.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-amber-50 border-amber-200">
        <HelpCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-700">Dica importante</AlertTitle>
        <AlertDescription>
          Os resultados deste diagnóstico servirão como ponto de partida para o planejamento 
          da implementação do Sistema de Gestão da Qualidade de acordo com o PBQP-H. 
          Quanto mais precisa for a avaliação inicial, mais efetivo será o plano de ação.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DiagnosticoInstructions;
