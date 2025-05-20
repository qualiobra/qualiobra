
import React, { useState, useEffect } from "react";
import { useUserRole } from "@/context/UserRoleContext";
import { useObras } from "@/hooks/useObras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { ChevronRight, ClipboardCheck, Building, Save } from "lucide-react";
import { QuestaoDiagnostico, RespostaOpcao } from "@/types/diagnostico";

// Dados simulados para questões de diagnóstico (os mesmos do SeedDiagnosticoData)
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
    NivelAplicavel: "Nível B",
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
    NivelAplicavel: "Nível B",
    CapituloRequisito: "8. Execução da Obra",
    SubItemRequisito: "8.1.1 Plano da Qualidade da Obra",
    DescricaoQuestao: "Para cada obra, a empresa elabora e documenta o respectivo Plano da Qualidade da Obra, consistente com os outros requisitos do SGQ? (Conforme SiAC Nível B: 8.1.1)",
    OrdemExibicao: 5,
    GrupoQuestao: "Operação",
    Ativa: true
  }
];

// Componente para Diagnóstico de Conformidade Inicial
export default function Diagnostico() {
  const { currentUserRole } = useUserRole();
  const { obras } = useObras();
  
  const [selectedTab, setSelectedTab] = useState<string>("novo");
  const [selectedNivel, setSelectedNivel] = useState<"Nível A" | "Nível B">("Nível B");
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);
  const [startedDiagnostic, setStartedDiagnostic] = useState(false);
  const [diagnosticoUUID] = useState<string>(uuidv4());
  
  // Verificar permissões do usuário
  const isAuthorized = currentUserRole && 
    (currentUserRole.id === "admin" || 
     currentUserRole.id === "engenheiro_gestor");

  // Se não autorizado, mostrar mensagem
  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  // Componente para o formulário de diagnóstico
  const DiagnosticoForm = () => {
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

    // Estado para armazenar as respostas
    const [respostas, setRespostas] = useState<Record<string, { 
      resposta: RespostaOpcao | null;
      justificativa: string;
    }>>({});
    
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
    };
    
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
          
          <div className="md:w-1/3 flex justify-end">
            <Button onClick={handleSalvarDiagnostico} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" /> Salvar Progresso
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          {Object.entries(questoesPorCapitulo).map(([capitulo, questoes]) => (
            <Card key={capitulo} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle>{capitulo}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {questoes.map((questao) => (
                    <div key={questao.IDQuestao} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-sm text-muted-foreground mb-1">
                            {questao.SubItemRequisito}
                          </p>
                          <p className="text-base">{questao.DescricaoQuestao}</p>
                          
                          {/* Exibir exigência conforme o nível */}
                          {selectedNivel === "Nível B" && questao.ExigenciaNivelB && (
                            <p className="mt-2 text-sm bg-blue-50 p-2 rounded border border-blue-100">
                              <span className="font-semibold">Exigência Nível B:</span> {questao.ExigenciaNivelB}
                            </p>
                          )}
                          
                          {selectedNivel === "Nível A" && questao.ExigenciaNivelA && (
                            <p className="mt-2 text-sm bg-purple-50 p-2 rounded border border-purple-100">
                              <span className="font-semibold">Exigência Nível A:</span> {questao.ExigenciaNivelA}
                            </p>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`resposta-${questao.IDQuestao}`}>Avaliação</Label>
                            <Select 
                              value={respostas[questao.IDQuestao]?.resposta || ""} 
                              onValueChange={(value) => handleRespostaChange(questao.IDQuestao, value as RespostaOpcao)}
                            >
                              <SelectTrigger id={`resposta-${questao.IDQuestao}`}>
                                <SelectValue placeholder="Selecione uma opção" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Atende Totalmente">Atende Totalmente</SelectItem>
                                <SelectItem value="Atende Parcialmente">Atende Parcialmente</SelectItem>
                                <SelectItem value="Não Atende">Não Atende</SelectItem>
                                <SelectItem value="Não se Aplica">Não se Aplica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`justificativa-${questao.IDQuestao}`}>Justificativa/Evidências</Label>
                            <Textarea 
                              id={`justificativa-${questao.IDQuestao}`}
                              placeholder="Registre as evidências ou justificativas para sua avaliação"
                              value={respostas[questao.IDQuestao]?.justificativa || ""}
                              onChange={(e) => handleJustificativaChange(questao.IDQuestao, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSalvarDiagnostico} size="lg">
            <Save className="mr-2 h-4 w-4" /> Salvar Progresso do Diagnóstico
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico de Conformidade Inicial</h1>
          <p className="text-muted-foreground mt-2">
            Avalie a conformidade com os requisitos do PBQP-H SiAC
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="novo">Novo Diagnóstico</TabsTrigger>
          <TabsTrigger value="salvos">Diagnósticos Salvos</TabsTrigger>
        </TabsList>

        <TabsContent value="novo">
          <DiagnosticoForm />
        </TabsContent>

        <TabsContent value="salvos">
          <div className="grid gap-4">
            {diagnosticosSalvos.map((diagnostico) => (
              <Card key={diagnostico.id} className="overflow-hidden">
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
                    <Button variant="ghost" size="sm">
                      {diagnostico.status === "Em Andamento" ? "Continuar" : "Ver Detalhes"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
