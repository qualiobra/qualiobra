
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NivelDiagnostico } from "@/types/diagnostico";

interface DiagnosticoTabsProps {
  tabAtiva: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const DiagnosticoTabs = ({ tabAtiva, onTabChange, children }: DiagnosticoTabsProps) => {
  return (
    <Tabs value={tabAtiva} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
        <TabsTrigger value="nivelB">Nível B</TabsTrigger>
        <TabsTrigger value="nivelA">Nível A</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default DiagnosticoTabs;
