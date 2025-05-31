
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";

import DiagnosticoHeader from "@/components/diagnostico/DiagnosticoHeader";
import DiagnosticoTabs from "@/components/diagnostico/DiagnosticoTabs";
import DiagnosticoContent from "@/components/diagnostico/DiagnosticoContent";
import useDiagnosticoQuestoes from "@/hooks/useDiagnosticoQuestoes";
import { toast } from "@/hooks/use-toast";

const Diagnostico = () => {
  const [tabAtiva, setTabAtiva] = useState('instrucoes');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    questoes, 
    isLoading, 
    error, 
    reloadQuestoes,
    fetchQuestoesDiagnostico 
  } = useDiagnosticoQuestoes(user?.id, !!isAuthenticated);

  // Verificar se usuário está logado quando tenta acessar o diagnóstico
  useEffect(() => {
    if (tabAtiva === 'diagnostico' && !isAuthenticated) {
      toast({
        title: "Atenção",
        description: "É necessário estar logado para acessar o diagnóstico.",
        variant: "destructive",
      });
      setTabAtiva('instrucoes');
    }
  }, [tabAtiva, isAuthenticated]);

  const handleTabChange = (value: string) => {
    if (value === 'diagnostico' && !isAuthenticated) {
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
            onNavigateBack={() => navigate(-1)}
            onRetry={reloadQuestoes}
          />
        </DiagnosticoTabs>
      </div>
    </div>
  );
};

export default Diagnostico;
