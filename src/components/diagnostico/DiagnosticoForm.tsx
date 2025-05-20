
import React, { useState } from "react";
import { useObras } from "@/hooks/useObras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Save, FileChartPie } from "lucide-react";
import { QuestaoDiagnostico, RespostaOpcao } from "@/types/diagnostico";
import { QuestoesCapitulo } from "./QuestoesCapitulo";
import { DiagnosticoSummary } from "./DiagnosticoSummary";

// Dados simulados para questões de diagnóstico - idealmente viriam de uma API/BD
const questoesExemplo: QuestaoDiagnostico[] = [
  {
    IDQuestao: "q1",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Nível B",
    CapituloRequisito: "4. Contexto da Empresa Construtora",
    SubItemRequisito: "4.1 Entendendo a empresa construtora e seu contexto",
    DescricaoQuestao: "A empresa determinou as questões internas e externas pertinentes para o seu propósito e para seu direcionamento estratégico, que afetem sua capacidade de alcançar o(s) resultado(s) pretendido(s) de seu Sistema de Gestão da Qualidade (SGQ)? (Conforme SiAC Nível B: 4.1)",
    OrdemExibicao: 1,
    GrupoQuestao: "Contexto e Estratégia",
    Ativa: true
  },
  {
    IDQuestao: "q2",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Nível B",
    CapituloRequisito: "5. Liderança",
    SubItemRequisito: "5.1.1 Generalidades (Liderança e Comprometimento)",
    DescricaoQuestao: "A Alta Direção demonstra liderança e comprometimento com relação ao sistema de gestão da qualidade, responsabilizando-se por prestar contas pela sua eficácia? (Conforme SiAC Nível B: 5.1.1a)",
    OrdemExibicao: 2,
    GrupoQuestao: "Liderança",
    Ativa: true
  },
  {
    IDQuestao: "q3",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Nível B",
    CapituloRequisito: "5. Liderança",
    SubItemRequisito: "5.2.1 Desenvolvendo a política da qualidade",
    DescricaoQuestao: "A Alta Direção estabeleceu, implementou e mantém uma política da qualidade que é apropriada ao propósito e ao contexto da empresa e apoia seu direcionamento estratégico? (Conforme SiAC Nível B: 5.2.1a)",
    OrdemExibicao: 3,
    GrupoQuestao: "Liderança",
    Ativa: true
  },
  {
    IDQuestao: "q4",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Ambos os Níveis",
    CapituloRequisito: "7. Apoio",
    SubItemRequisito: "7.1.1 Generalidades (Recursos)",
    DescricaoQuestao: "A empresa determinou e provê os recursos necessários para o estabelecimento, implementação, manutenção e melhoria contínua do sistema de gestão da qualidade? (Conforme SiAC Nível B: 7.1.1)",
    OrdemExibicao: 4,
    GrupoQuestao: "Recursos e Apoio",
    Ativa: true
  },
  {
    IDQuestao: "q5",
    ReferencialNormativo: "PBQP-H SiAC",
    NivelAplicavel: "Nível A",
    CapituloRequisito: "8. Execução da Obra",
    SubItemRequisito: "8.1.1 Plano da Qualidade da Obra",
    DescricaoQuestao: "Para cada obra, a empresa elabora e documenta o respectivo Plano da Qualidade da Obra, consistente com os outros requisitos do SGQ? (Conforme SiAC Nível B: 8.1.1)",
    ExigenciaNivelA: "Além do plano básico, deve incluir indicadores de desempenho do processo.",
    OrdemExibicao: 5,
    GrupoQuestao: "Operação",
    Ativa: true
  }
];

export function DiagnosticoForm() {
  const { obras } = useObras();
  const [selectedNivel, setSelectedNivel] = useState<"Nível A" | "Nível B">("Nível B");
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);
  const [diagnosticoUUID] = useState<string>(uuidv4());
  const [respostas, setRespostas] = useState<Record<string, { 
    resposta: RespostaOpcao | null;
    justificativa: string;
  }>>({});
  const [mostraSumario, setMostraSumario] = useState<boolean>(false);

  // Filtrar questões conforme o nível selecionado
  const questoesFiltradas = questoesExemplo.filter(q => 
    q.Ativa && (q.NivelAplicavel === selectedNivel || q.NivelAplicavel === "Ambos os Níveis")
  ).sort((a, b) => a.OrdemExibicao - b.OrdemExibicao);
  
  // Agrupar questões por capítulo
  const questoesPorCapitulo = questoesFiltradas.reduce((acc, questao) => {
    const capitulo = questao.CapituloRequisito;
    if (!acc[capitulo]) {
      acc[capitulo] = [];
    }
    acc[capitulo].push(questao);
    return acc;
  }, {} as Record<string, QuestaoDiagnostico[]>);

  // Manipulador para alteração de resposta
  const handleRespostaChange = (questaoId: string, valor: RespostaOpcao) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: {
        ...prev[questaoId],
        resposta: valor
      }
    }));
  };
  
  // Manipulador para alteração de justificativa
  const handleJustificativaChange = (questaoId: string, valor: string) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: {
        ...prev[questaoId],
        justificativa: valor
      }
    }));
  };
  
  // Manipulador para salvar diagnóstico
  const handleSalvarDiagnostico = () => {
    // Verificar se há respostas para salvar
    const temRespostas = Object.values(respostas).some(r => r.resposta !== null);
    
    if (!temRespostas) {
      toast({
        title: "Nenhuma resposta preenchida",
        description: "Por favor, responda pelo menos uma questão antes de salvar.",
        variant: "destructive"
      });
      return;
    }
    
    // Em produção, aqui salvaria no banco de dados
    // Por enquanto, apenas simulamos o salvamento
    const obraSelecionada = obras.find(o => o.id === selectedObraId);
    
    toast({
      title: "Progresso salvo com sucesso!",
      description: `Diagnóstico ${selectedNivel} ${obraSelecionada ? `para obra ${obraSelecionada.nome}` : 'geral'} salvo.`,
    });
    
    console.log("Dados do diagnóstico:", {
      idDiagnostico: diagnosticoUUID,
      nivel: selectedNivel,
      obraId: selectedObraId,
      respostas
    });

    // Mostrar sumário após salvar
    setMostraSumario(true);
  };

  // Converter as respostas para o formato usado pelo componente de sumário
  const respostasDiagnostico = Object.entries(respostas)
    .filter(([_, valor]) => valor.resposta !== null)
    .map(([questaoId, valor]) => ({
      IDRespostaDiagnostico: `resp-${questaoId}`,
      IDUsuarioAvaliador: "user-id", // Em produção, seria o ID real do usuário
      IDQuestaoRespondida: questaoId,
      NivelDiagnosticoRealizado: selectedNivel,
      RespostaUsuario: valor.resposta as RespostaOpcao,
      JustificativaEvidencias: valor.justificativa,
      DataHoraResposta: new Date().toISOString(),
      IDDiagnosticoAgrupador: diagnosticoUUID
    }));

  const obraSelecionada = obras.find(o => o.id === selectedObraId);

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 md:w-1/3">
          <Label htmlFor="nivel-diagnostico">Nível do Diagnóstico</Label>
          <Select 
            value={selectedNivel} 
            onValueChange={(value) => setSelectedNivel(value as "Nível A" | "Nível B")}
          >
            <SelectTrigger id="nivel-diagnostico">
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nível B">Nível B</SelectItem>
              <SelectItem value="Nível A">Nível A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:w-1/3">
          <Label htmlFor="obra-diagnostico">Obra (Opcional)</Label>
          <Select 
            value={selectedObraId || "diagnostico_geral"} 
            onValueChange={(value) => setSelectedObraId(value === "diagnostico_geral" ? null : value)}
          >
            <SelectTrigger id="obra-diagnostico">
              <SelectValue placeholder="Selecione uma obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diagnostico_geral">Diagnóstico Geral (Sem Obra)</SelectItem>
              {obras.map((obra) => (
                <SelectItem key={obra.id} value={obra.id}>
                  {obra.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:w-1/3 flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setMostraSumario(!mostraSumario)}
            disabled={!Object.values(respostas).some(r => r.resposta !== null)}
          >
            <FileChartPie className="mr-2 h-4 w-4" /> 
            {mostraSumario ? "Editar Diagnóstico" : "Ver Resumo"}
          </Button>
          
          <Button onClick={handleSalvarDiagnostico} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" /> Salvar Progresso
          </Button>
        </div>
      </div>
      
      {mostraSumario ? (
        <DiagnosticoSummary 
          nivel={selectedNivel}
          obraNome={obraSelecionada?.nome}
          respostas={respostasDiagnostico}
          questoes={questoesFiltradas.map(q => ({ 
            IDQuestao: q.IDQuestao, 
            CapituloRequisito: q.CapituloRequisito,
            DescricaoQuestao: q.DescricaoQuestao
          }))}
        />
      ) : (
        <>
          <div className="space-y-8">
            {Object.entries(questoesPorCapitulo).map(([capitulo, questoes]) => (
              <QuestoesCapitulo
                key={capitulo}
                capitulo={capitulo}
                questoes={questoes}
                selectedNivel={selectedNivel}
                respostas={respostas}
                onRespostaChange={handleRespostaChange}
                onJustificativaChange={handleJustificativaChange}
              />
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSalvarDiagnostico} size="lg">
              <Save className="mr-2 h-4 w-4" /> Salvar Progresso do Diagnóstico
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
