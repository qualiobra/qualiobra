
import { useState } from "react";
import { QuestoesDiagnostico, NivelDiagnostico } from "@/types/diagnostico";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Check, AlertCircle, Info, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface QuestoesDiagnosticoListProps {
  questoes: QuestoesDiagnostico[];
  isLoading: boolean;
  nivel: NivelDiagnostico;
}

const QuestoesDiagnosticoList = ({ questoes, isLoading, nivel }: QuestoesDiagnosticoListProps) => {
  const [respostas, setRespostas] = useState<Record<string, { pontuacao: number; observacao: string }>>({});
  const [progresso, setProgresso] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  
  // Gerar um ID único para este diagnóstico quando o componente é montado
  const [diagnosticoId] = useState(() => uuidv4());

  const handleRespostaChange = (idQuestao: string, pontuacao: number) => {
    setRespostas(prev => ({
      ...prev,
      [idQuestao]: { 
        pontuacao, 
        observacao: prev[idQuestao]?.observacao || "" 
      }
    }));
    
    // Atualizar progresso
    const totalRespondidas = Object.keys(respostas).length + (respostas[idQuestao] ? 0 : 1);
    setProgresso(Math.round((totalRespondidas / questoes.length) * 100));
  };

  const handleObservacaoChange = (idQuestao: string, observacao: string) => {
    setRespostas(prev => ({
      ...prev,
      [idQuestao]: { 
        pontuacao: prev[idQuestao]?.pontuacao || 0, 
        observacao 
      }
    }));
  };

  const handleSalvar = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar respostas.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Preparar os dados para inserção
      const respostasArray = Object.entries(respostas).map(([id_questao, { pontuacao, observacao }]) => ({
        id_resposta_diagnostico: uuidv4(),
        id_usuario_avaliador: user.id,
        id_questao_respondida: id_questao,
        nivel_diagnostico_realizado: nivel === 'Ambos os Níveis' ? 'Nível B' : nivel,
        pontuacao_usuario: pontuacao,
        observacoes_usuario: observacao || null,
        data_hora_resposta: new Date().toISOString(),
        id_diagnostico_agrupador: diagnosticoId,
      }));
      
      // Inserir respostas no banco de dados
      const { error } = await supabase
        .from('respostas_diagnostico_usuario')
        .insert(respostasArray);
      
      if (error) {
        console.error("Erro ao salvar respostas:", error);
        throw error;
      }
      
      toast({
        title: "Respostas salvas",
        description: "Suas respostas foram salvas com sucesso.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar suas respostas. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  const renderEscalaOpcoes = (idQuestao: string, tipoPontuacao: string) => {
    if (tipoPontuacao === "Sim/Não (1 ou 5)") {
      return (
        <RadioGroup 
          value={respostas[idQuestao]?.pontuacao?.toString() || ""} 
          onValueChange={(value) => handleRespostaChange(idQuestao, parseInt(value))}
        >
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id={`${idQuestao}-nao`} />
              <Label htmlFor={`${idQuestao}-nao`}>Não (1)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id={`${idQuestao}-sim`} />
              <Label htmlFor={`${idQuestao}-sim`}>Sim (5)</Label>
            </div>
          </div>
        </RadioGroup>
      );
    } else {
      return (
        <RadioGroup 
          value={respostas[idQuestao]?.pontuacao?.toString() || ""} 
          onValueChange={(value) => handleRespostaChange(idQuestao, parseInt(value))}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id={`${idQuestao}-1`} />
              <Label htmlFor={`${idQuestao}-1`}>1 - Não implementado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id={`${idQuestao}-2`} />
              <Label htmlFor={`${idQuestao}-2`}>2 - Parcialmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id={`${idQuestao}-3`} />
              <Label htmlFor={`${idQuestao}-3`}>3 - Implementado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id={`${idQuestao}-4`} />
              <Label htmlFor={`${idQuestao}-4`}>4 - Documentado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id={`${idQuestao}-5`} />
              <Label htmlFor={`${idQuestao}-5`}>5 - Melhorado</Label>
            </div>
          </div>
        </RadioGroup>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (questoes.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Informação</AlertTitle>
        <AlertDescription>
          Não foram encontradas questões de diagnóstico para o {nivel}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Progresso: {progresso}%</span>
          <span>{Object.keys(respostas).length} de {questoes.length} questões respondidas</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {questoes.map((questao) => {
          const respondida = !!respostas[questao.id_questao]?.pontuacao;
          
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
                      {getPontuacaoLabel(respostas[questao.id_questao].pontuacao, questao.tipo_pontuacao)}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <p className="text-gray-700">{questao.descricao_questao}</p>
                  
                  <div className="mt-4">
                    <Label>Avaliação</Label>
                    {renderEscalaOpcoes(questao.id_questao, questao.tipo_pontuacao)}
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor={`obs-${questao.id_questao}`}>Observações e evidências</Label>
                    <Textarea 
                      id={`obs-${questao.id_questao}`}
                      placeholder="Descreva as evidências encontradas ou anote observações relevantes"
                      value={respostas[questao.id_questao]?.observacao || ""}
                      onChange={(e) => handleObservacaoChange(questao.id_questao, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSalvar} 
          disabled={Object.keys(respostas).length === 0 || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            "Salvar Respostas"
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestoesDiagnosticoList;
