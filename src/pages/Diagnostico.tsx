
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { NivelDiagnostico } from "@/types/diagnostico";

import DiagnosticoHeader from "@/components/diagnostico/DiagnosticoHeader";
import DiagnosticoTabs from "@/components/diagnostico/DiagnosticoTabs";
import DiagnosticoContent from "@/components/diagnostico/DiagnosticoContent";
import useDiagnosticoQuestoes from "@/hooks/useDiagnosticoQuestoes";

const Diagnostico = () => {
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelDiagnostico>("Nível B");
  const [tabAtiva, setTabAtiva] = useState('instrucoes');
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const { 
    questoes, 
    isLoading, 
    error, 
    reloadQuestoes,
    fetchQuestoesDiagnostico 
  } = useDiagnosticoQuestoes(nivelSelecionado, user?.id, !!isSignedIn);

  const handleTabChange = (value: string) => {
    setTabAtiva(value);
    if (value === 'nivelB') {
      setNivelSelecionado("Nível B");
    } else if (value === 'nivelA') {
      setNivelSelecionado("Nível A");
    }
  };

  // Load questions when tab changes to a nivel tab
  useEffect(() => {
    if (tabAtiva === 'nivelB' || tabAtiva === 'nivelA') {
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
