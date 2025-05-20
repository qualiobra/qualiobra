
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { QuestoesDiagnostico, NivelDiagnostico } from "@/types/diagnostico";
import QuestoesDiagnosticoList from "@/components/diagnostico/QuestoesDiagnosticoList";
import DiagnosticoInstructions from "@/components/diagnostico/DiagnosticoInstructions";
import { useUser } from "@clerk/clerk-react";

const Diagnostico = () => {
  const [questoes, setQuestoes] = useState<QuestoesDiagnostico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelDiagnostico>("Nível B");
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    const fetchQuestoesDiagnostico = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("questoes_diagnostico")
          .select("*")
          .eq("ativa", true)
          .or(`nivel_aplicavel.eq.${nivelSelecionado},nivel_aplicavel.eq.Ambos os Níveis`)
          .order("ordem_exibicao", { ascending: true });

        if (error) throw error;
        
        setQuestoes(data as QuestoesDiagnostico[]);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao carregar questões:", err);
        setError(err.message || "Erro ao carregar as questões do diagnóstico");
        toast({
          title: "Erro",
          description: "Não foi possível carregar as questões do diagnóstico.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestoesDiagnostico();
  }, [nivelSelecionado, isSignedIn, navigate]);

  return (
    <div className="container mx-auto py-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico PBQP-H SiAC</CardTitle>
            <CardDescription>
              Selecione o nível que deseja avaliar e responda às questões para obter uma análise de conformidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="instrucoes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
                <TabsTrigger value="nivelB" onClick={() => setNivelSelecionado("Nível B")}>Nível B</TabsTrigger>
                <TabsTrigger value="nivelA" onClick={() => setNivelSelecionado("Nível A")}>Nível A</TabsTrigger>
              </TabsList>
              
              <TabsContent value="instrucoes">
                <DiagnosticoInstructions />
              </TabsContent>
              
              <TabsContent value="nivelB">
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <QuestoesDiagnosticoList 
                    questoes={questoes.filter(q => q.nivel_aplicavel === "Nível B" || q.nivel_aplicavel === "Ambos os Níveis")}
                    isLoading={isLoading}
                    nivel="Nível B"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="nivelA">
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <QuestoesDiagnosticoList 
                    questoes={questoes.filter(q => q.nivel_aplicavel === "Nível A" || q.nivel_aplicavel === "Ambos os Níveis")}
                    isLoading={isLoading}
                    nivel="Nível A"
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Diagnostico;
