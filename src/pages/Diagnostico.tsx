
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { NivelDiagnostico } from "@/types/diagnostico";

import DiagnosticoHeader from "@/components/diagnostico/DiagnosticoHeader";
import DiagnosticoTabs from "@/components/diagnostico/DiagnosticoTabs";
import DiagnosticoContent from "@/components/diagnostico/DiagnosticoContent";
import useDiagnosticoQuestoes from "@/hooks/useDiagnosticoQuestoes";
import { toast } from "@/components/ui/use-toast";

const Diagnostico = () => {
  const [tabAtiva, setTabAtiva] = useState('instrucoes');
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  
  // Usamos "Ambos os Níveis" como padrão para considerar todos os requisitos
  const nivelSelecionado: NivelDiagnostico = "Ambos os Níveis";

  const { 
    questoes, 
    isLoading, 
    error, 
    reloadQuestoes,
    fetchQuestoesDiagnostico 
  } = useDiagnosticoQuestoes(nivelSelecionado, user?.id, !!isSignedIn);

  // Verificar se usuário está logado quando tenta acessar o diagnóstico
  useEffect(() => {
    if (tabAtiva === 'diagnostico' && !isSignedIn) {
      toast({
        title: "Atenção",
        description: "É necessário estar logado para acessar o diagnóstico.",
        variant: "destructive",
      });
      setTabAtiva('instrucoes');
    }
  }, [tabAtiva, isSignedIn]);

  const handleTabChange = (value: string) => {
    if (value === 'diagnostico' && !isSignedIn) {
      toast({
        title: "Atenção",
        description: "É necessário estar logado para acessar o diagnóstico.",
        variant: "destructive",
      });
      return;
    }
    
    setTabAtiva(value);
    if (value === 'diagnostico') {
      fetchQuestoesDiagnostico();
    }
  };

  // Verificação do usuário e carregamento das questões
  useEffect(() => {
    if (tabAtiva === 'diagnostico') {
      fetchQuestoesDiagnostico();
    }
  }, [tabAtiva, fetchQuestoesDiagnostico]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <DiagnosticoHeader />

        <DiagnosticoTabs tabAtiva={tabAtiva} onTabChange={handleTabChange}>
          <DiagnosticoContent
            questoes={questoes}
            isLoading={isLoading}
            error={error}
            nivelSelecionado={nivelSelecionado}
            onNavigateBack={() => navigate(-1)}
            onRetry={reloadQuestoes}
          />
        </DiagnosticoTabs>
      </div>
    </div>
  );
};

export default Diagnostico;
