
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { QuestoesDiagnostico } from "@/types/diagnostico";
import DiagnosticoInstructions from "@/components/diagnostico/DiagnosticoInstructions";
import QuestoesDiagnosticoList from "@/components/diagnostico/QuestoesDiagnosticoList";

interface DiagnosticoContentProps {
  questoes: QuestoesDiagnostico[];
  isLoading: boolean;
  error: string | null;
  onNavigateBack: () => void;
  onRetry: () => void;
}

const DiagnosticoContent = ({
  questoes,
  isLoading,
  error,
  onNavigateBack,
  onRetry
}: DiagnosticoContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico PBQP-H SiAC</CardTitle>
        <CardDescription>
          Responda às questões agrupadas por requisito da norma para obter uma análise completa de conformidade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TabsContent value="instrucoes">
          <DiagnosticoInstructions />
        </TabsContent>
        
        <TabsContent value="diagnostico">
          <QuestoesDiagnosticoList 
            questoes={questoes}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </TabsContent>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onNavigateBack}>Voltar</Button>
      </CardFooter>
    </Card>
  );
};

export default DiagnosticoContent;
