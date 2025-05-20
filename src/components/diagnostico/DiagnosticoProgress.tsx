
import { Progress } from "@/components/ui/progress";

interface DiagnosticoProgressProps {
  progresso: number;
  totalRespondidas: number;
  totalQuestoes: number;
}

const DiagnosticoProgress = ({ 
  progresso, 
  totalRespondidas, 
  totalQuestoes 
}: DiagnosticoProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Progresso: {progresso}%</span>
        <span>{totalRespondidas} de {totalQuestoes} questões respondidas</span>
      </div>
      <Progress value={progresso} className="h-2" />
    </div>
  );
};

export default DiagnosticoProgress;
