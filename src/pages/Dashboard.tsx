
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { NonConformitiesChart } from "@/components/dashboard/NonConformitiesChart";
import { RecentInspections } from "@/components/dashboard/RecentInspections";
import { PendingTasks } from "@/components/dashboard/PendingTasks";
import { SeedDiagnosticoData } from "@/components/diagnostico/SeedDiagnosticoData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="container space-y-4 py-4 md:space-y-6 md:py-6 lg:space-y-8 lg:py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de qualidade da sua empresa
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ComplianceChart />
        <NonConformitiesChart />
      </div>

      <Tabs defaultValue="pendingTasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendingTasks">Tarefas Pendentes</TabsTrigger>
          <TabsTrigger value="recentInspections">Inspeções Recentes</TabsTrigger>
          <TabsTrigger value="adminTools">Ferramentas de Administração</TabsTrigger>
        </TabsList>
        <TabsContent value="pendingTasks" className="space-y-4">
          <PendingTasks />
        </TabsContent>
        <TabsContent value="recentInspections" className="space-y-4">
          <RecentInspections />
        </TabsContent>
        <TabsContent value="adminTools" className="space-y-4 grid md:grid-cols-2 gap-4">
          <SeedDiagnosticoData />
        </TabsContent>
      </Tabs>
    </div>
  );
}
