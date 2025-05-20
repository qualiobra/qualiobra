
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileChartPie } from "lucide-react";
import { DiagnosticoSummary } from "./DiagnosticoSummary";

// Exemplo de dados simulados completos para o sumário
const dadosSimuladosSumario = {
  "diag-1": {
    respostas: [
      { IDRespostaDiagnostico: "r1", IDQuestaoRespondida: "q1", RespostaUsuario: "Atende Totalmente", JustificativaEvidencias: "Evidência documentada", IDUsuarioAvaliador: "user1", NivelDiagnosticoRealizado: "Nível B", DataHoraResposta: "2023-05-15T10:30:00Z", IDDiagnosticoAgrupador: "diag-1" },
      { IDRespostaDiagnostico: "r2", IDQuestaoRespondida: "q2", RespostaUsuario: "Atende Parcialmente", JustificativaEvidencias: "Implementação parcial", IDUsuarioAvaliador: "user1", NivelDiagnosticoRealizado: "Nível B", DataHoraResposta: "2023-05-15T10:32:00Z", IDDiagnosticoAgrupador: "diag-1" },
      { IDRespostaDiagnostico: "r3", IDQuestaoRespondida: "q3", RespostaUsuario: "Não Atende", JustificativaEvidencias: "Não implementado", IDUsuarioAvaliador: "user1", NivelDiagnosticoRealizado: "Nível B", DataHoraResposta: "2023-05-15T10:35:00Z", IDDiagnosticoAgrupador: "diag-1" },
    ],
    questoes: [
      { IDQuestao: "q1", CapituloRequisito: "4. Contexto da Empresa", DescricaoQuestao: "A empresa determina questões internas e externas?" },
      { IDQuestao: "q2", CapituloRequisito: "5. Liderança", DescricaoQuestao: "A Alta Direção demonstra liderança e comprometimento?" },
      { IDQuestao: "q3", CapituloRequisito: "5. Liderança", DescricaoQuestao: "Existe uma política da qualidade estabelecida?" },
    ]
  },
  "diag-2": {
    respostas: [
      { IDRespostaDiagnostico: "r4", IDQuestaoRespondida: "q1", RespostaUsuario: "Atende Totalmente", JustificativaEvidencias: "Documentação completa", IDUsuarioAvaliador: "user1", NivelDiagnosticoRealizado: "Nível A", DataHoraResposta: "2023-04-28T16:45:00Z", IDDiagnosticoAgrupador: "diag-2" },
      { IDRespostaDiagnostico: "r5", IDQuestaoRespondida: "q2", RespostaUsuario: "Atende Totalmente", JustificativaEvidencias: "Totalmente implementado", IDUsuarioAvaliador: "user1", NivelDiagnosticoRealizado: "Nível A", DataHoraResposta: "2023-04-28T16:48:00Z", IDDiagnosticoAgrupador: "diag-2" },
      { IDRespostaDiagnostico: "r6", IDQuestaoRespondida: "q3", RespostaUsuario: "Atende Parcialmente", JustificativaEvidencias: "Em fase de implementação", IDUsuarioAvaliador: "user1", NivelDiagnosticoRealizado: "Nível A", DataHoraResposta: "2023-04-28T16:50:00Z", IDDiagnosticoAgrupador: "diag-2" },
    ],
    questoes: [
      { IDQuestao: "q1", CapituloRequisito: "4. Contexto da Empresa", DescricaoQuestao: "A empresa determina questões internas e externas?" },
      { IDQuestao: "q2", CapituloRequisito: "5. Liderança", DescricaoQuestao: "A Alta Direção demonstra liderança e comprometimento?" },
      { IDQuestao: "q3", CapituloRequisito: "5. Liderança", DescricaoQuestao: "Existe uma política da qualidade estabelecida?" },
    ]
  }
};

export function DiagnosticosList() {
  const [selectedDiagnostico, setSelectedDiagnostico] = useState<string | null>(null);
  
  // Estado simulado para diagnósticos salvos
  const diagnosticosSalvos = [
    { 
      id: "diag-1", 
      data: "2023-05-15T10:30:00Z", 
      nivel: "Nível B", 
      obra: "Residencial Vista Verde",
      progresso: 60,
      status: "Em Andamento"
    },
    { 
      id: "diag-2", 
      data: "2023-04-28T16:45:00Z", 
      nivel: "Nível A", 
      obra: "Edifício Comercial Central",
      progresso: 100,
      status: "Concluído"
    }
  ];

  const handleViewSummary = (id: string) => {
    setSelectedDiagnostico(prev => prev === id ? null : id);
  };

  return (
    <div className="grid gap-4">
      {diagnosticosSalvos.map((diagnostico) => (
        <React.Fragment key={diagnostico.id}>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-6 items-center">
              <div className="md:col-span-5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{diagnostico.obra || "Diagnóstico Geral"}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    diagnostico.status === "Concluído" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {diagnostico.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {new Date(diagnostico.data).toLocaleDateString()} • {diagnostico.nivel}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${diagnostico.progresso}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-right">
                  {diagnostico.progresso}% completo
                </p>
              </div>
              <div className="bg-gray-50 p-6 flex justify-center border-l md:h-full">
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewSummary(diagnostico.id)}>
                    <FileChartPie className="mr-2 h-4 w-4" />
                    {selectedDiagnostico === diagnostico.id ? "Ocultar Resumo" : "Ver Resumo"}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    {diagnostico.status === "Em Andamento" ? "Continuar" : "Ver Detalhes"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {selectedDiagnostico === diagnostico.id && dadosSimuladosSumario[diagnostico.id] && (
            <DiagnosticoSummary
              nivel={diagnostico.nivel as "Nível A" | "Nível B"}
              obraNome={diagnostico.obra}
              respostas={dadosSimuladosSumario[diagnostico.id].respostas}
              questoes={dadosSimuladosSumario[diagnostico.id].questoes}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
