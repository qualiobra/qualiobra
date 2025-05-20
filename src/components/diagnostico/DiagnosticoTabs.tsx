
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiagnosticoTabsProps {
  tabAtiva: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const DiagnosticoTabs = ({ tabAtiva, onTabChange, children }: DiagnosticoTabsProps) => {
  return (
    <Tabs value={tabAtiva} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
        <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default DiagnosticoTabs;
