
import React, { useState } from "react";
import { QuestaoDiagnostico } from "@/types/diagnostico";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Dados de exemplo para questões de diagnóstico
const questoesExemplo: Omit<QuestaoDiagnostico, 'IDQuestao'>[] = [
  {
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

export function SeedDiagnosticoData() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedComplete, setSeedComplete] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    
    try {
      // Em produção, aqui teríamos a integração com Supabase
      // Simulando inserção de dados com um timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso da inserção
      toast({
        title: "Dados inseridos com sucesso",
        description: `${questoesExemplo.length} questões de diagnóstico foram adicionadas à base de dados.`,
      });
      
      setSeedComplete(true);
    } catch (error) {
      console.error("Erro ao inserir dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao inserir dados",
        description: "Ocorreu um erro ao tentar adicionar as questões de diagnóstico.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carregar Dados de Exemplo</CardTitle>
        <CardDescription>
          Insira questões de exemplo para o diagnóstico PBQP-H SiAC Nível B
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Esta ação irá inserir 5 questões de exemplo na base de dados para o diagnóstico PBQP-H SiAC Nível B.
          IDQuestao será gerado automaticamente para cada questão.
        </p>
        
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
          <h4 className="text-sm font-medium mb-2">Resumo das questões a serem inseridas:</h4>
          <ul className="text-xs space-y-1 list-disc pl-4">
            {questoesExemplo.map((questao, index) => (
              <li key={index} className="text-slate-600">
                {questao.CapituloRequisito} - {questao.SubItemRequisito}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSeedData}
          disabled={isSeeding || seedComplete}
          className="w-full"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inserindo dados...
            </>
          ) : seedComplete ? (
            "Dados inseridos com sucesso"
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" /> Inserir Dados de Exemplo
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
