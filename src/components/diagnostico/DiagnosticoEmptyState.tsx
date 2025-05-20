
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { NivelDiagnostico } from "@/types/diagnostico";
import { Button } from "@/components/ui/button";

interface DiagnosticoEmptyStateProps {
  nivel: NivelDiagnostico;
  error?: string | null;
  onRetry?: () => void;
}

const DiagnosticoEmptyState = ({ nivel, error, onRetry }: DiagnosticoEmptyStateProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Erro ao carregar questões</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              Tentar novamente
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

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
