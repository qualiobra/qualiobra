
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  QuestaoAvaliacao, 
  SecaoAvaliacao, 
  RespostaAvaliacao,
  AvaliacaoPBQPH
} from "@/types/obra";

// Dados estáticos das seções e questões de avaliação do PBQP-H
const secoesDiagnostico: SecaoAvaliacao[] = [
  {
    id: "req-4",
    titulo: "Requisito 4 - Requisitos gerais",
    questoes: [
      {
        id: "4.1.1",
        requisito: "4.1",
        item: "4.1.1",
        descricao: "Foi realizado um diagnóstico da situação da empresa, em relação aos presentes requisitos do SIAC, no início do desenvolvimento do sistema de gestão da qualidade?",
        tipoResposta: "escala"
      },
      {
        id: "4.1.2",
        requisito: "4.1",
        item: "4.1.2",
        descricao: "A organização definiu claramente o(s) subsetor(es) e tipo(s) de obra abrangido(s) pelo sistema de gestão da qualidade?",
        tipoResposta: "escala"
      },
      {
        id: "4.1.3",
        requisito: "4.1",
        item: "4.1.3",
        descricao: "Os processos necessários para o sistema de gestão da qualidade e suas aplicações ao longo da organização são identificados?",
        tipoResposta: "escala"
      },
      {
        id: "4.1.4",
        requisito: "4.1",
        item: "4.1.4",
        descricao: "A sequência e interação destes processos são determinadas?",
        tipoResposta: "escala"
      }
    ]
  },
  {
    id: "req-5",
    titulo: "Requisito 5 - Liderança",
    questoes: [
      {
        id: "5.1.1",
        requisito: "5.1",
        item: "5.1.1",
        descricao: "A Direção comunica aos profissionais da empresa e àqueles de empresas subcontratadas para a execução dos serviços controlados da importância em atender aos requisitos do cliente, assim como aos regulamentares e estatutários?",
        tipoResposta: "escala"
      },
      {
        id: "5.1.2",
        requisito: "5.1",
        item: "5.1.2",
        descricao: "Política da Qualidade é estabelecida?",
        tipoResposta: "escala"
      },
      {
        id: "5.1.3",
        requisito: "5.1",
        item: "5.1.3",
        descricao: "Objetivos da Qualidade são estabelecidos e os seus indicadores estão sendo acompanhados?",
        tipoResposta: "escala"
      }
    ]
  },
  {
    id: "req-7",
    titulo: "Requisito 7 - Execução da obra",
    questoes: [
      {
        id: "7.1.1",
        requisito: "7.1",
        item: "7.1.1",
        descricao: "A organização planeja, desenvolve e documenta, para cada uma de suas obras, o Plano da Qualidade da Obra para a realização do produto? Esse planejamento é consistente com os requisitos dos outros processos do Sistema?",
        tipoResposta: "escala"
      },
      {
        id: "7.2.1",
        requisito: "7.2",
        item: "7.2.1",
        descricao: "São determinados os requisitos da obra especificados pelo cliente, incluindo requisitos para entrega e de atividades pós-entrega?",
        tipoResposta: "escala"
      },
      {
        id: "7.3.1",
        requisito: "7.3",
        item: "7.3.1",
        descricao: "A organização planeja e controla o projeto e desenvolvimento do produto, determinando os estágios de projeto e desenvolvimento?",
        tipoResposta: "escala"
      }
    ]
  },
  {
    id: "req-8",
    titulo: "Requisito 8 - Medição, análise e melhoria",
    questoes: [
      {
        id: "8.1.1",
        requisito: "8.1",
        item: "8.1.1",
        descricao: "A organização planeja e implementa os processos necessários de monitoramento, medição, análise e melhoria para demonstrar a conformidade do produto?",
        tipoResposta: "escala"
      },
      {
        id: "8.2.1",
        requisito: "8.2",
        item: "8.2.1",
        descricao: "Como uma das medições do desempenho do sistema de gestão da qualidade, são monitoradas informações relativas à percepção dos clientes sobre se a organização atendeu aos requisitos dos clientes?",
        tipoResposta: "escala"
      },
      {
        id: "8.3.1",
        requisito: "8.3",
        item: "8.3.1",
        descricao: "A organização assegura que produtos que não estejam conforme com os requisitos do produto são identificados e controlados para evitar seu uso não intencional ou entrega?",
        tipoResposta: "escala"
      }
    ]
  }
];

const Diagnostico = () => {
  const [activeSection, setActiveSection] = useState<string>(secoesDiagnostico[0].id);
  const [respostas, setRespostas] = useState<RespostaAvaliacao[]>([]);
  const [diagnosticoConcluido, setDiagnosticoConcluido] = useState(false);
  const [resultados, setResultados] = useState<{geral: number, porSecao: Record<string, number>}>({
    geral: 0,
    porSecao: {}
  });
  const [progresso, setProgresso] = useState(0);

  // Carregar respostas do localStorage (simulação de banco de dados)
  useEffect(() => {
    const avaliacaoSalva = localStorage.getItem("avaliacaoPBQPH");
    if (avaliacaoSalva) {
      const avaliacao: AvaliacaoPBQPH = JSON.parse(avaliacaoSalva);
      setRespostas(avaliacao.respostas);
      
      if (avaliacao.concluida) {
        setDiagnosticoConcluido(true);
        setResultados({
          geral: avaliacao.resultadoGeral || 0,
          porSecao: avaliacao.resultadosPorSecao || {}
        });
      }
      
      calcularProgresso(avaliacao.respostas);
    }
  }, []);

  // Salvar respostas no localStorage a cada alteração
  useEffect(() => {
    if (respostas.length > 0) {
      const avaliacaoAtual: AvaliacaoPBQPH = {
        id: "atual",
        usuarioId: "usuario-teste",
        dataInicio: new Date().toISOString(),
        respostas: respostas,
        concluida: diagnosticoConcluido,
        resultadoGeral: resultados.geral,
        resultadosPorSecao: resultados.porSecao
      };
      
      localStorage.setItem("avaliacaoPBQPH", JSON.stringify(avaliacaoAtual));
      calcularProgresso(respostas);
    }
  }, [respostas, diagnosticoConcluido, resultados]);

  const calcularProgresso = (resp: RespostaAvaliacao[]) => {
    const totalQuestoes = secoesDiagnostico.reduce(
      (total, secao) => total + secao.questoes.length, 
      0
    );
    const questoesRespondidas = resp.length;
    const porcentagem = (questoesRespondidas / totalQuestoes) * 100;
    setProgresso(Math.round(porcentagem));
  };

  const handleRespostaChange = (questaoId: string, valor: number, observacoes?: string) => {
    setRespostas(prevRespostas => {
      // Verificar se já existe resposta para esta questão
      const respostaExistente = prevRespostas.findIndex(r => r.questaoId === questaoId);
      
      if (respostaExistente >= 0) {
        // Atualizar resposta existente
        const novasRespostas = [...prevRespostas];
        novasRespostas[respostaExistente] = {
          questaoId,
          valor,
          observacoes
        };
        return novasRespostas;
      } else {
        // Adicionar nova resposta
        return [...prevRespostas, {
          questaoId,
          valor,
          observacoes
        }];
      }
    });
  };

  const getRespostaParaQuestao = (questaoId: string): RespostaAvaliacao | undefined => {
    return respostas.find(r => r.questaoId === questaoId);
  };

  const calcularResultados = () => {
    // Cálculo médio por seção
    const resultadosPorSecao: Record<string, number> = {};
    
    secoesDiagnostico.forEach(secao => {
      let somaSecao = 0;
      let questoesRespondidasSecao = 0;
      
      secao.questoes.forEach(questao => {
        const resposta = getRespostaParaQuestao(questao.id);
        if (resposta) {
          somaSecao += resposta.valor;
          questoesRespondidasSecao++;
        }
      });
      
      if (questoesRespondidasSecao > 0) {
        resultadosPorSecao[secao.id] = parseFloat((somaSecao / questoesRespondidasSecao).toFixed(2));
      }
    });
    
    // Cálculo média geral
    let somaGeral = 0;
    let totalQuestoesRespondidas = 0;
    
    Object.values(resultadosPorSecao).forEach(media => {
      somaGeral += media;
      totalQuestoesRespondidas++;
    });
    
    const mediaGeral = totalQuestoesRespondidas > 0 
      ? parseFloat((somaGeral / totalQuestoesRespondidas).toFixed(2)) 
      : 0;
    
    return {
      geral: mediaGeral,
      porSecao: resultadosPorSecao
    };
  };

  const concluirDiagnostico = () => {
    // Verificar se todas as questões foram respondidas
    let todasQuestoesRespondidas = true;
    let questoesFaltantes: string[] = [];
    
    secoesDiagnostico.forEach(secao => {
      secao.questoes.forEach(questao => {
        const resposta = getRespostaParaQuestao(questao.id);
        if (!resposta) {
          todasQuestoesRespondidas = false;
          questoesFaltantes.push(`${questao.item}`);
        }
      });
    });
    
    if (!todasQuestoesRespondidas) {
      toast({
        variant: "destructive",
        title: "Diagnóstico incompleto",
        description: `Faltam respostas para as questões: ${questoesFaltantes.join(", ")}.`,
      });
      return;
    }
    
    const resultadosCalculados = calcularResultados();
    setResultados(resultadosCalculados);
    setDiagnosticoConcluido(true);
    
    toast({
      title: "Diagnóstico concluído!",
      description: "Seu diagnóstico PBQP-H foi finalizado com sucesso!",
    });
  };

  const exportarPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Seu diagnóstico será exportado e enviado para seu email.",
    });
  };

  const solicitarContato = () => {
    toast({
      title: "Solicitação enviada",
      description: "Um especialista entrará em contato em breve para discutir os resultados do seu diagnóstico.",
    });
  };

  const getFeedbackMessage = (mediaGeral: number): string => {
    if (mediaGeral >= 4.5) {
      return "Excelente! Sua empresa demonstra maturidade nos processos de gestão da qualidade conforme os requisitos do PBQP-H. Recomendamos seguir com o processo de certificação.";
    } else if (mediaGeral >= 3.5) {
      return "Bom resultado! Sua empresa está bem encaminhada, mas ainda existem pontos a melhorar para atender plenamente os requisitos do PBQP-H.";
    } else if (mediaGeral >= 2.5) {
      return "Resultado intermediário. Sua empresa precisa aprimorar diversos aspectos para atender aos requisitos do PBQP-H adequadamente.";
    } else {
      return "Atenção! Sua empresa necessita de melhorias significativas nos processos de gestão da qualidade para atender aos requisitos do PBQP-H.";
    }
  };
  
  const getClasseResultado = (valor: number): string => {
    if (valor >= 4.5) return "text-green-600 font-bold";
    if (valor >= 3.5) return "text-blue-600 font-bold";
    if (valor >= 2.5) return "text-amber-600 font-bold";
    return "text-red-600 font-bold";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Diagnóstico PBQP-H</h1>
          <p className="text-muted-foreground mb-4">
            Avalie a conformidade da sua empresa em relação aos requisitos do PBQP-H.
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Progresso</span>
              <span>{progresso}%</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </div>
        </div>
        
        {!diagnosticoConcluido ? (
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Avaliação</CardTitle>
              <CardDescription>
                Responda todas as questões de acordo com a situação atual da sua empresa.
                Para cada requisito, atribua uma pontuação de 1 a 5 conforme indicado:
              </CardDescription>
              
              <div className="mt-4 text-sm">
                <p><strong>1</strong> - Não existe o item na empresa</p>
                <p><strong>2</strong> - O item existe, porém não está documentado</p>
                <p><strong>3</strong> - O item existe e está parcialmente documentado</p>
                <p><strong>4</strong> - O item existe e está totalmente documentado</p>
                <p><strong>5</strong> - O item existe, está documentado, implantado e mantido</p>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  {secoesDiagnostico.map(secao => (
                    <TabsTrigger key={secao.id} value={secao.id}>
                      {secao.titulo.split(" - ")[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {secoesDiagnostico.map(secao => (
                  <TabsContent key={secao.id} value={secao.id} className="space-y-8">
                    <h3 className="text-xl font-bold">{secao.titulo}</h3>
                    {secao.subtitulo && <p className="text-muted-foreground">{secao.subtitulo}</p>}
                    
                    <div className="space-y-6">
                      {secao.questoes.map(questao => {
                        const resposta = getRespostaParaQuestao(questao.id);
                        
                        return (
                          <Card key={questao.id} className="border-l-4 border-l-primary">
                            <CardContent className="pt-6">
                              <div className="mb-4">
                                <h4 className="font-bold text-base">{questao.item}</h4>
                                <p>{questao.descricao}</p>
                              </div>
                              
                              <div className="mb-4">
                                <h5 className="text-sm font-medium mb-2">Pontuação:</h5>
                                <RadioGroup
                                  value={resposta?.valor?.toString()}
                                  onValueChange={(value) => handleRespostaChange(questao.id, parseInt(value), resposta?.observacoes)}
                                  className="flex space-x-2"
                                >
                                  {[1, 2, 3, 4, 5].map(valor => (
                                    <div key={valor} className="flex items-center space-x-1">
                                      <RadioGroupItem value={valor.toString()} id={`${questao.id}-${valor}`} />
                                      <Label htmlFor={`${questao.id}-${valor}`}>{valor}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                              
                              <div>
                                <Label htmlFor={`obs-${questao.id}`} className="text-sm font-medium mb-2">
                                  Observações (opcional):
                                </Label>
                                <Textarea
                                  id={`obs-${questao.id}`}
                                  placeholder="Adicione observações sobre este requisito"
                                  value={resposta?.observacoes || ""}
                                  onChange={(e) => {
                                    if (resposta) {
                                      handleRespostaChange(questao.id, resposta.valor, e.target.value);
                                    }
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.setItem("avaliacaoPBQPH", JSON.stringify({
                    id: "atual",
                    usuarioId: "usuario-teste",
                    dataInicio: new Date().toISOString(),
                    respostas: respostas,
                    concluida: false
                  }));
                  
                  toast({
                    title: "Progresso salvo",
                    description: "Você pode continuar o diagnóstico mais tarde.",
                  });
                }}
              >
                Salvar progresso
              </Button>
              <Button onClick={concluirDiagnostico}>Concluir diagnóstico</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Resultados do Diagnóstico PBQP-H</CardTitle>
              <CardDescription>
                Confira abaixo os resultados do seu diagnóstico
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-xl mb-2">Pontuação média geral</h3>
                <p className={`text-4xl ${getClasseResultado(resultados.geral)}`}>{resultados.geral}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Resultados por seção:</h3>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Seção</th>
                      <th className="text-center py-2">Média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secoesDiagnostico.map(secao => (
                      <tr key={secao.id} className="border-b">
                        <td className="py-2">{secao.titulo}</td>
                        <td className={`text-center py-2 ${getClasseResultado(resultados.porSecao[secao.id] || 0)}`}>
                          {resultados.porSecao[secao.id] || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-2">Análise do resultado:</h3>
                  <p>{getFeedbackMessage(resultados.geral)}</p>
                </CardContent>
              </Card>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto" onClick={exportarPDF}>
                Exportar como PDF
              </Button>
              <Button className="w-full sm:w-auto" variant="outline" onClick={solicitarContato}>
                Solicitar contato com especialista
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Diagnostico;
