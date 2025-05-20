
import { QuestoesDiagnostico, NivelDiagnostico } from "@/types/diagnostico";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

import DiagnosticoProgress from "./DiagnosticoProgress";
import DiagnosticoLoading from "./DiagnosticoLoading";
import DiagnosticoEmptyState from "./DiagnosticoEmptyState";
import DiagnosticoQuestaoItem from "./DiagnosticoQuestaoItem";
import useDiagnosticoRespostas from "@/hooks/useDiagnosticoRespostas";

interface QuestoesDiagnosticoListProps {
  questoes: QuestoesDiagnostico[];
  isLoading: boolean;
  nivel: NivelDiagnostico;
  error?: string | null;
  onRetry?: () => void;
}

const QuestoesDiagnosticoList = ({ 
  questoes, 
  isLoading, 
  nivel, 
  error, 
  onRetry 
}: QuestoesDiagnosticoListProps) => {
  const { user, isSignedIn } = useUser();
  const { 
    respostas, 
    progresso, 
    isSaving, 
    totalRespondidas,
    handleRespostaChange, 
    handleObservacaoChange,
    salvarRespostas
  } = useDiagnosticoRespostas(questoes.length, nivel);
  
  const handleSalvar = () => {
    if (!isSignedIn) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para salvar respostas. Faça login e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      salvarRespostas(user.id);
    }
  };

  if (isLoading) {
    return <DiagnosticoLoading />;
  }

  if (error) {
    return <DiagnosticoEmptyState nivel={nivel} error={error} onRetry={onRetry} />;
  }

  if (questoes.length === 0) {
    return <DiagnosticoEmptyState nivel={nivel} />;
  }

  return (
    <div className="space-y-6">
      <DiagnosticoProgress 
        progresso={progresso} 
        totalRespondidas={totalRespondidas} 
        totalQuestoes={questoes.length} 
      />

      <Accordion type="single" collapsible className="w-full">
        {questoes.map((questao) => (
          <DiagnosticoQuestaoItem
            key={questao.id_questao}
            questao={questao}
            pontuacao={respostas[questao.id_questao]?.pontuacao}
            observacao={respostas[questao.id_questao]?.observacao}
            onPontuacaoChange={handleRespostaChange}
            onObservacaoChange={handleObservacaoChange}
          />
        ))}
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
