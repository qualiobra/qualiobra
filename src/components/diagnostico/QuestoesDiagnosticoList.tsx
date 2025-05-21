
import { QuestoesDiagnostico } from "@/types/diagnostico";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

import DiagnosticoProgress from "./DiagnosticoProgress";
import DiagnosticoLoading from "./DiagnosticoLoading";
import DiagnosticoEmptyState from "./DiagnosticoEmptyState";
import DiagnosticoRequisitoGrupo from "./DiagnosticoRequisitoGrupo";
import useDiagnosticoRespostas from "@/hooks/useDiagnosticoRespostas";
import { agruparQuestoesPorRequisito } from "@/utils/diagnosticoGroupUtils";

interface QuestoesDiagnosticoListProps {
  questoes: QuestoesDiagnostico[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const QuestoesDiagnosticoList = ({ 
  questoes, 
  isLoading, 
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
  } = useDiagnosticoRespostas(questoes.length);
  
  // Agrupar questões por requisito
  const gruposDeQuestoes = agruparQuestoesPorRequisito(questoes);
  
  const handleSalvar = () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para salvar respostas. Faça login e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    // Usa o ID como texto do Clerk (agora convertido automaticamente para string)
    console.log("Salvando respostas para usuário:", user.id);
    salvarRespostas(user.id);
  };

  if (isLoading) {
    return <DiagnosticoLoading />;
  }

  if (error) {
    return <DiagnosticoEmptyState error={error} onRetry={onRetry} />;
  }

  if (questoes.length === 0) {
    return <DiagnosticoEmptyState />;
  }

  return (
    <div className="space-y-6">
      <DiagnosticoProgress 
        progresso={progresso} 
        totalRespondidas={totalRespondidas} 
        totalQuestoes={questoes.length} 
      />

      <Accordion type="single" collapsible className="w-full">
        {gruposDeQuestoes.map((grupo) => (
          <DiagnosticoRequisitoGrupo
            key={grupo.requisito}
            grupo={grupo}
            respostas={respostas}
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
