
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { QuestaoDiagnostico, RespostaDiagnostico } from "@/types/diagnostico";
import { RespostaDiagnosticoForm } from "./RespostaDiagnosticoForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

// Dados de amostra - em produção viriam do Supabase
const questoesMock: QuestaoDiagnostico[] = [
  {
    IDQuestao: "1",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Ambos os Níveis",
    CapituloRequisito: "4.1 Requisitos Gerais",
    DescricaoQuestao: "A empresa estabeleceu, documentou, implementou e mantém um Sistema de Gestão da Qualidade?",
    ExigenciaNivelB: "Deve possuir Manual da Qualidade e procedimentos documentados conforme exigido pelo SiAC.",
    ExigenciaNivelA: "Além das exigências do nível B, deve também possuir plano da qualidade para obras.",
    OrdemExibicao: 1,
    Ativa: true
  },
  {
    IDQuestao: "2",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Ambos os Níveis",
    CapituloRequisito: "4.2 Requisitos de Documentação",
    SubItemRequisito: "4.2.1 Generalidades",
    DescricaoQuestao: "A documentação do SGQ inclui declarações da política e objetivos da qualidade?",
    ExigenciaNivelB: "Deve possuir política e objetivos da qualidade documentados.",
    ExigenciaNivelA: "Além da exigência do nível B, deve haver monitoramento dos objetivos.",
    OrdemExibicao: 2,
    Ativa: true
  },
  {
    IDQuestao: "3",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Nível A",
    CapituloRequisito: "8.2 Medição e Monitoramento",
    SubItemRequisito: "8.2.1 Satisfação do Cliente",
    DescricaoQuestao: "A empresa monitora informações relativas à percepção do cliente?",
    ExigenciaNivelA: "Deve possuir metodologia e registros de avaliação da satisfação do cliente.",
    OrdemExibicao: 3,
    Ativa: true
  }
];

type DiagnosticoSessionProps = {
  nivelDiagnostico: "Nível A" | "Nível B";
  obraId?: string;
};

export function DiagnosticoSession({ nivelDiagnostico, obraId }: DiagnosticoSessionProps) {
  const [questoes, setQuestoes] = useState<QuestaoDiagnostico[]>([]);
  const [respostas, setRespostas] = useState<RespostaDiagnostico[]>([]);
  const [questaoAtualIndex, setQuestaoAtualIndex] = useState(0);
  const [diagnosticoId, setDiagnosticoId] = useState<string>(crypto.randomUUID());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filtra as questões pelo nível aplicável
  useEffect(() => {
    // Em produção, buscar do Supabase com filtro
    const questoesFiltradas = questoesMock.filter(
      q => q.NivelAplicavel === nivelDiagnostico || q.NivelAplicavel === "Ambos os Níveis"
    );
    setQuestoes(questoesFiltradas);
  }, [nivelDiagnostico]);

  const handleSalvarResposta = (data: any) => {
    const questaoAtual = questoes[questaoAtualIndex];
    
    // Cria objeto de resposta
    const novaResposta: RespostaDiagnostico = {
      IDRespostaDiagnostico: crypto.randomUUID(),
      IDUsuarioAvaliador: "user-id", // Em produção, pegar do contexto de autenticação
      IDObraAvaliada: obraId,
      IDQuestaoRespondida: questaoAtual.IDQuestao,
      NivelDiagnosticoRealizado: nivelDiagnostico,
      RespostaUsuario: data.respostaUsuario,
      JustificativaEvidencias: data.justificativaEvidencias,
      DataHoraResposta: new Date().toISOString(),
      IDDiagnosticoAgrupador: diagnosticoId
    };

    // Atualiza resposta existente ou adiciona nova
    const respostaExistenteIndex = respostas.findIndex(
      r => r.IDQuestaoRespondida === questaoAtual.IDQuestao
    );

    if (respostaExistenteIndex >= 0) {
      const novasRespostas = [...respostas];
      novasRespostas[respostaExistenteIndex] = novaResposta;
      setRespostas(novasRespostas);
    } else {
      setRespostas([...respostas, novaResposta]);
    }

    // Avança para próxima questão ou finaliza
    if (questaoAtualIndex < questoes.length - 1) {
      setQuestaoAtualIndex(questaoAtualIndex + 1);
      toast({
        title: "Resposta salva",
        description: "Avançando para a próxima questão",
      });
    } else {
      toast({
        title: "Diagnóstico concluído",
        description: "Todas as questões foram respondidas!",
      });
      // Em produção, salvar todas as respostas no Supabase e redirecionar para tela de resumo
    }
  };

  const handleNavegacao = (direcao: "anterior" | "proxima") => {
    if (direcao === "anterior" && questaoAtualIndex > 0) {
      setQuestaoAtualIndex(questaoAtualIndex - 1);
    } else if (direcao === "proxima" && questaoAtualIndex < questoes.length - 1) {
      setQuestaoAtualIndex(questaoAtualIndex + 1);
    }
  };

  const getRespostaParaQuestaoAtual = () => {
    if (!questoes.length) return undefined;
    
    const questaoAtual = questoes[questaoAtualIndex];
    return respostas.find(r => r.IDQuestaoRespondida === questaoAtual.IDQuestao);
  };

  // Calcular progresso
  const progresso = questoes.length ? ((respostas.length / questoes.length) * 100) : 0;

  if (!questoes.length) {
    return <div className="text-center py-8">Carregando questões...</div>;
  }

  const questaoAtual = questoes[questaoAtualIndex];
  const respostaAtual = getRespostaParaQuestaoAtual();

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Diagnóstico de Conformidade {nivelDiagnostico}
        </h2>
        <p className="text-muted-foreground mb-4">
          {obraId ? "Obra específica" : "Diagnóstico geral"} • 
          Respondidas: {respostas.length} de {questoes.length}
        </p>
        <Progress value={progresso} className="h-2" />
      </div>

      <div className="relative">
        <RespostaDiagnosticoForm
          questao={questaoAtual}
          nivelDiagnostico={nivelDiagnostico}
          onSubmit={handleSalvarResposta}
          defaultValues={
            respostaAtual
              ? {
                  respostaUsuario: respostaAtual.RespostaUsuario,
                  justificativaEvidencias: respostaAtual.JustificativaEvidencias,
                }
              : undefined
          }
        />

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => handleNavegacao("anterior")}
            disabled={questaoAtualIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Questão Anterior
          </Button>

          <Button
            variant="outline"
            onClick={() => handleNavegacao("proxima")}
            disabled={questaoAtualIndex === questoes.length - 1}
          >
            Próxima Questão <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Salvar diagnóstico para continuar depois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Você pode salvar o progresso atual e continuar o diagnóstico mais tarde. Todas as 
              respostas já fornecidas serão mantidas.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Salvar e Sair
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
