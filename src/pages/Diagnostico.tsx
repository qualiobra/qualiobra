
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { QuestoesDiagnostico, NivelDiagnostico, DiagnosticoComResposta } from "@/types/diagnostico";
import QuestoesDiagnosticoList from "@/components/diagnostico/QuestoesDiagnosticoList";
import DiagnosticoInstructions from "@/components/diagnostico/DiagnosticoInstructions";
import { useUser } from "@clerk/clerk-react";

const Diagnostico = () => {
  const [questoes, setQuestoes] = useState<QuestoesDiagnostico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelDiagnostico>("Nível B");
  const [error, setError] = useState<string | null>(null);
  const [tabAtiva, setTabAtiva] = useState('instrucoes');
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const fetchQuestoesDiagnostico = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Consulta para buscar questões baseada no nível selecionado
      const { data, error: fetchError } = await supabase
        .from("questoes_diagnostico")
        .select("*")
        .eq("ativa", true);

      if (fetchError) {
        console.error("Erro ao buscar questões:", fetchError);
        throw new Error(`Erro ao buscar questões: ${fetchError.message}`);
      }
      
      if (!data || data.length === 0) {
        console.log("Nenhuma questão encontrada para o diagnóstico");
        setQuestoes([]);
      } else {
        console.log(`Encontradas ${data.length} questões para diagnóstico`);
        
        // Filtrar as questões baseadas no nível selecionado
        const questoesDoNivel = data.filter(questao => {
          if (nivelSelecionado === "Nível B") {
            return questao.exigencia_siac_nivel_b !== 'N/A';
          }
          if (nivelSelecionado === "Nível A") {
            return questao.exigencia_siac_nivel_a !== 'N/A';
          }
          // Para "Ambos os Níveis"
          return true;
        });
        
        // Buscamos as respostas do usuário atual apenas se ele estiver autenticado
        if (user && isSignedIn && questoesDoNivel.length > 0) {
          try {
            const { data: respostas, error: respostasError } = await supabase
              .from('respostas_diagnostico_usuario')
              .select('*')
              .eq('id_usuario_avaliador', user.id)
              .eq('nivel_diagnostico_realizado', nivelSelecionado);
              
            if (respostasError) {
              console.warn("Erro ao buscar respostas do usuário:", respostasError);
              // Continuamos mesmo se houver erro nas respostas
            }
            
            if (respostas && respostas.length > 0) {
              // Mapeamos as respostas para as questões
              const questoesComRespostas = questoesDoNivel.map(questao => {
                const resposta = respostas.find(r => r.id_questao_respondida === questao.id_questao);
                return resposta ? { ...questao, resposta } : questao;
              });
              setQuestoes(questoesComRespostas);
            } else {
              setQuestoes(questoesDoNivel);
            }
          } catch (respostasErr) {
            console.error("Erro ao processar respostas:", respostasErr);
            setQuestoes(questoesDoNivel);
          }
        } else {
          // Se não estiver autenticado, apenas definimos as questões
          setQuestoes(questoesDoNivel);
        }
      }
    } catch (err: any) {
      console.error("Erro ao carregar questões:", err);
      setError(err.message || "Não foi possível carregar as questões do diagnóstico.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar as questões do diagnóstico.",
        variant: "destructive",
      });
      setQuestoes([]);
    } finally {
      setIsLoading(false);
    }
  }, [nivelSelecionado, user, isSignedIn]);

  useEffect(() => {
    if (tabAtiva === 'nivelB' || tabAtiva === 'nivelA') {
      fetchQuestoesDiagnostico();
    }
  }, [tabAtiva, fetchQuestoesDiagnostico]);

  const handleTabChange = (value: string) => {
    setTabAtiva(value);
    if (value === 'nivelB') {
      setNivelSelecionado("Nível B");
    } else if (value === 'nivelA') {
      setNivelSelecionado("Nível A");
    }
  };

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
            <Tabs value={tabAtiva} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
                <TabsTrigger value="nivelB">Nível B</TabsTrigger>
                <TabsTrigger value="nivelA">Nível A</TabsTrigger>
              </TabsList>
              
              <TabsContent value="instrucoes">
                <DiagnosticoInstructions />
              </TabsContent>
              
              <TabsContent value="nivelB">
                <QuestoesDiagnosticoList 
                  questoes={questoes}
                  isLoading={isLoading}
                  nivel="Nível B"
                  error={error}
                  onRetry={fetchQuestoesDiagnostico}
                />
              </TabsContent>
              
              <TabsContent value="nivelA">
                <QuestoesDiagnosticoList 
                  questoes={questoes}
                  isLoading={isLoading}
                  nivel="Nível A"
                  error={error}
                  onRetry={fetchQuestoesDiagnostico}
                />
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
