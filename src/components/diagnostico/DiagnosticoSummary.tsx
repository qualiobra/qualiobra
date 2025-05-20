
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { calcularPercentualConformidade, RespostaDiagnostico, RespostaOpcao } from "@/types/diagnostico";
import { ChartPie, ListChecks } from "lucide-react";

interface CapituloSummary {
  capitulo: string;
  atendeTotalmente: number;
  atendeParcialmente: number;
  naoAtende: number;
  naoAplica: number;
  totalQuestoes: number;
}

interface DiagnosticoSummaryProps {
  nivel: "Nível A" | "Nível B";
  obraNome?: string;
  respostas: RespostaDiagnostico[];
  questoes: {
    IDQuestao: string;
    CapituloRequisito: string;
    DescricaoQuestao: string;
  }[];
}

export function DiagnosticoSummary({ nivel, obraNome, respostas, questoes }: DiagnosticoSummaryProps) {
  // Agrupar respostas por capítulo
  const resumoPorCapitulo = questoes.reduce<Record<string, CapituloSummary>>((acc, questao) => {
    const capitulo = questao.CapituloRequisito;
    if (!acc[capitulo]) {
      acc[capitulo] = {
        capitulo,
        atendeTotalmente: 0,
        atendeParcialmente: 0,
        naoAtende: 0,
        naoAplica: 0,
        totalQuestoes: 0
      };
    }

    // Encontra a resposta para esta questão
    const respostaQuestao = respostas.find(resp => resp.IDQuestaoRespondida === questao.IDQuestao);
    
    if (respostaQuestao) {
      switch(respostaQuestao.RespostaUsuario) {
        case "Atende Totalmente":
          acc[capitulo].atendeTotalmente += 1;
          break;
        case "Atende Parcialmente":
          acc[capitulo].atendeParcialmente += 1;
          break;
        case "Não Atende":
          acc[capitulo].naoAtende += 1;
          break;
        case "Não se Aplica":
          acc[capitulo].naoAplica += 1;
          break;
      }
    }
    
    acc[capitulo].totalQuestoes += 1;
    return acc;
  }, {});

  // Calcular totais gerais
  const totais = Object.values(resumoPorCapitulo).reduce(
    (acc, capitulo) => {
      acc.atendeTotalmente += capitulo.atendeTotalmente;
      acc.atendeParcialmente += capitulo.atendeParcialmente;
      acc.naoAtende += capitulo.naoAtende;
      acc.naoAplica += capitulo.naoAplica;
      acc.totalQuestoes += capitulo.totalQuestoes;
      return acc;
    },
    { atendeTotalmente: 0, atendeParcialmente: 0, naoAtende: 0, naoAplica: 0, totalQuestoes: 0 }
  );

  // Calcular percentual de aderência
  const totalQuestoesAplicaveis = totais.totalQuestoes - totais.naoAplica;
  const percentualAderencia = calcularPercentualConformidade(
    totalQuestoesAplicaveis,
    totais.atendeTotalmente,
    totais.atendeParcialmente
  );

  // Pontos de melhoria (questões que não atendem ou atendem parcialmente)
  const pontosMelhoria = respostas
    .filter(resp => resp.RespostaUsuario === "Não Atende" || resp.RespostaUsuario === "Atende Parcialmente")
    .map(resp => {
      const questao = questoes.find(q => q.IDQuestao === resp.IDQuestaoRespondida);
      return {
        descricao: questao?.DescricaoQuestao || "Questão não encontrada",
        resposta: resp.RespostaUsuario,
        justificativa: resp.JustificativaEvidencias,
      };
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xl flex items-center gap-2">
            <ChartPie className="h-5 w-5" />
            Resumo do Diagnóstico - {nivel}
            {obraNome && <span className="text-muted-foreground text-base ml-2">({obraNome})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Percentual de Aderência Geral</h3>
              <span className="font-semibold">{percentualAderencia.toFixed(1)}%</span>
            </div>
            <Progress value={percentualAderencia} className="h-3" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Resumo por Capítulo/Requisito</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Capítulo/Requisito</TableHead>
                    <TableHead>Atende Totalmente</TableHead>
                    <TableHead>Atende Parcialmente</TableHead>
                    <TableHead>Não Atende</TableHead>
                    <TableHead>Não se Aplica</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(resumoPorCapitulo).map((capitulo) => (
                    <TableRow key={capitulo.capitulo}>
                      <TableCell>{capitulo.capitulo}</TableCell>
                      <TableCell>{capitulo.atendeTotalmente}</TableCell>
                      <TableCell>{capitulo.atendeParcialmente}</TableCell>
                      <TableCell>{capitulo.naoAtende}</TableCell>
                      <TableCell>{capitulo.naoAplica}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/20 font-medium">
                    <TableCell>Total Geral</TableCell>
                    <TableCell>{totais.atendeTotalmente}</TableCell>
                    <TableCell>{totais.atendeParcialmente}</TableCell>
                    <TableCell>{totais.naoAtende}</TableCell>
                    <TableCell>{totais.naoAplica}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {pontosMelhoria.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <ListChecks className="mr-2 h-4 w-4" /> 
                Pontos de Atenção (Não Atende ou Atende Parcialmente)
              </h3>
              <div className="space-y-4">
                {pontosMelhoria.map((ponto, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{ponto.descricao}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          ponto.resposta === "Não Atende" 
                            ? "bg-destructive/10 text-destructive" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {ponto.resposta}
                        </span>
                      </div>
                      {ponto.justificativa && (
                        <p className="text-sm text-muted-foreground mt-2">{ponto.justificativa}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
