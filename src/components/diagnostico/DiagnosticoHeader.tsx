
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DiagnosticoHeader = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Diagnóstico Inicial de Conformidade</h1>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Informação</AlertTitle>
        <AlertDescription>
          Este diagnóstico ajudará a avaliar o grau de conformidade da sua empresa com os requisitos da norma PBQP-H SiAC.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DiagnosticoHeader;
