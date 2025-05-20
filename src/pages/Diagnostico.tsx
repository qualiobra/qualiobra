
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

      const { data, error } = await supabase
        .from("questoes_diagnostico")
        .select("*")
        .eq("ativa", true)
        .or(`nivel_aplicavel.eq.${nivelSelecionado},nivel_aplicavel.eq.Ambos os Níveis`)
        .order("ordem_exibicao", { ascending: true });

      if (error) throw error;
      
      // Se temos um usuário autenticado, vamos buscar também as respostas anteriores
      if (user) {
        const questoesComRespostas = await obterQuestoesComRespostas(data as QuestoesDiagnostico[]);
        setQuestoes(questoesComRespostas);
      } else {
        setQuestoes(data as QuestoesDiagnostico[]);
      }
      
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
  }, [nivelSelecionado, user]);

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

  const obterQuestoesComRespostas = async (questoes: QuestoesDiagnostico[]): Promise<QuestoesDiagnostico[]> => {
    if (!user) return questoes;
    
    try {
      // Buscar a última resposta de cada questão para este usuário
      const { data: respostas, error } = await supabase
        .from('respostas_diagnostico_usuario')
        .select('*')
        .eq('id_usuario_avaliador', user.id)
        .eq('nivel_diagnostico_realizado', nivelSelecionado === 'Ambos os Níveis' ? 'Nível B' : nivelSelecionado);
        
      if (error) throw error;

      if (respostas && respostas.length > 0) {
        // Criar um mapa de respostas por ID de questão para obter a resposta mais recente
        const mapaRespostas: Record<string, any> = {};
        
        respostas.forEach(resposta => {
          const idQuestao = resposta.id_questao_respondida;
          
          // Verificar se já temos uma resposta para esta questão ou se esta é mais recente
          if (!mapaRespostas[idQuestao] || new Date(resposta.data_hora_resposta) > new Date(mapaRespostas[idQuestao].data_hora_resposta)) {
            mapaRespostas[idQuestao] = resposta;
          }
        });
        
        // Associar as respostas às questões
        return questoes.map(questao => ({
          ...questao,
          resposta: mapaRespostas[questao.id_questao]
        }));
      }
      
      return questoes;
    } catch (err) {
      console.error("Erro ao buscar respostas:", err);
      return questoes;
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
                  questoes={questoes.filter(q => q.nivel_aplicavel === "Nível B" || q.nivel_aplicavel === "Ambos os Níveis")}
                  isLoading={isLoading}
                  nivel="Nível B"
                  error={error}
                  onRetry={fetchQuestoesDiagnostico}
                />
              </TabsContent>
              
              <TabsContent value="nivelA">
                <QuestoesDiagnosticoList 
                  questoes={questoes.filter(q => q.nivel_aplicavel === "Nível A" || q.nivel_aplicavel === "Ambos os Níveis")}
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
