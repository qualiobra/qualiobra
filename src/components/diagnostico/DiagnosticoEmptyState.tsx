
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { NivelDiagnostico } from "@/types/diagnostico";

interface DiagnosticoEmptyStateProps {
  nivel: NivelDiagnostico;
}

const DiagnosticoEmptyState = ({ nivel }: DiagnosticoEmptyStateProps) => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Informação</AlertTitle>
      <AlertDescription>
        Não foram encontradas questões de diagnóstico para o {nivel}.
      </AlertDescription>
    </Alert>
  );
};

export default DiagnosticoEmptyState;
