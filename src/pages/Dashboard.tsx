
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Gauge, ClipboardCheck, Users, TrendingUp, TrendingDown, Bell } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import NonConformitiesChart from "@/components/dashboard/NonConformitiesChart";
import RecentInspections from "@/components/dashboard/RecentInspections";
import PendingTasks from "@/components/dashboard/PendingTasks";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bem-vindo ao Dashboard QualiObra</DialogTitle>
            <DialogDescription>
              Aqui você pode monitorar métricas de qualidade, acompanhar inspeções e gerenciar suas equipes em todos os canteiros de obras.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <p>Novos recursos disponíveis:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Formulários de inspeção aprimorados com capacidade de upload de fotos</li>
              <li>Notificações por WhatsApp para não-conformidades urgentes</li>
              <li>Métricas de desempenho da equipe e rankings</li>
            </ul>
            <Button onClick={() => setShowWelcome(false)} className="w-full">
              Começar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Qualidade</h1>
          <p className="text-gray-600">Monitore métricas de qualidade em todos os seus projetos de construção</p>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">
              <Gauge className="mr-2 h-4 w-4" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger value="inspections">
              <ClipboardCheck className="mr-2 h-4 w-4" /> Inspeções
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="mr-2 h-4 w-4" /> Equipe
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" /> Notificações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total de Inspeções</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">324</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Taxa de Conformidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">88%</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">+3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Não-Conformidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">42</div>
                    <div className="flex items-center text-red-500">
                      <TrendingDown className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">-8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Tarefas Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">16</div>
                    <div className="flex items-center text-amber-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">+2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Métricas de Conformidade</CardTitle>
                  <CardDescription>Conformidade mensal por categoria</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ComplianceChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Não-Conformidades</CardTitle>
                  <CardDescription>Problemas por gravidade e status</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <NonConformitiesChart />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Pending Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Inspeções Recentes</CardTitle>
                  <CardDescription>Últimas 5 inspeções em todos os canteiros</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentInspections />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Tarefas Pendentes</CardTitle>
                  <CardDescription>Tarefas que requerem atenção</CardDescription>
                </CardHeader>
                <CardContent>
                  <PendingTasks />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections">
            <Card>
              <CardHeader>
                <CardTitle>Inspeções</CardTitle>
                <CardDescription>Gerencie todos os formulários e relatórios de inspeção</CardDescription>
              </CardHeader>
              <CardContent>
                <p>O conteúdo das inspeções será exibido aqui...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho da Equipe</CardTitle>
                <CardDescription>Visualize estatísticas da equipe e classificações</CardDescription>
              </CardHeader>
              <CardContent>
                <p>O conteúdo de desempenho da equipe será exibido aqui...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure alertas e preferências de notificação</CardDescription>
              </CardHeader>
              <CardContent>
                <p>As configurações de notificação serão exibidas aqui...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
