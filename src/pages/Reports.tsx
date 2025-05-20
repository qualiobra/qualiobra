
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Download, Filter } from "lucide-react";

const Reports = () => {
  const [reportType, setReportType] = useState("compliance");
  const [period, setPeriod] = useState("monthly");
  
  // Dados de exemplo para os gráficos
  const complianceData = [
    { month: "Jan", conformes: 85, naoConformes: 15 },
    { month: "Fev", conformes: 75, naoConformes: 25 },
    { month: "Mar", conformes: 92, naoConformes: 8 },
    { month: "Abr", conformes: 78, naoConformes: 22 },
    { month: "Mai", conformes: 88, naoConformes: 12 },
    { month: "Jun", conformes: 95, naoConformes: 5 },
  ];
  
  const inspectionData = [
    { month: "Jan", realizadas: 45, previstas: 50 },
    { month: "Fev", realizadas: 42, previstas: 50 },
    { month: "Mar", realizadas: 48, previstas: 50 },
    { month: "Abr", realizadas: 50, previstas: 50 },
    { month: "Mai", realizadas: 47, previstas: 50 },
    { month: "Jun", realizadas: 49, previstas: 50 },
  ];
  
  const categoryData = [
    { category: "Fundação", conformes: 92, naoConformes: 8 },
    { category: "Estrutura", conformes: 85, naoConformes: 15 },
    { category: "Alvenaria", conformes: 78, naoConformes: 22 },
    { category: "Elétrica", conformes: 95, naoConformes: 5 },
    { category: "Hidráulica", conformes: 88, naoConformes: 12 },
    { category: "Acabamento", conformes: 90, naoConformes: 10 },
  ];

  // Determine qual conjunto de dados usar com base no tipo de relatório
  const chartData = 
    reportType === "compliance" ? complianceData :
    reportType === "inspection" ? inspectionData : categoryData;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Analise dados de conformidade, inspeções e não-conformidades por categoria.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Relatório de {
                reportType === "compliance" ? "Conformidade" :
                reportType === "inspection" ? "Inspeções" : "Categorias"
              }</CardTitle>
              <CardDescription>
                {
                  reportType === "compliance" ? "Análise de itens conformes e não-conformes" :
                  reportType === "inspection" ? "Comparativo de inspeções realizadas vs. previstas" :
                  "Conformidade por categoria de inspeção"
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 self-end">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Conformidade</SelectItem>
                    <SelectItem value="inspection">Inspeções</SelectItem>
                    <SelectItem value="category">Por Categoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={reportType === "category" ? "category" : "month"} 
                  label={{ 
                    value: reportType === "category" ? "Categorias" : "Mês", 
                    position: "insideBottom", 
                    offset: -10 
                  }} 
                />
                <YAxis 
                  label={{ 
                    value: "Quantidade", 
                    angle: -90, 
                    position: "insideLeft" 
                  }} 
                />
                <Tooltip 
                  formatter={(value, name) => {
                    const formattedName = 
                      name === "conformes" ? "Conformes" :
                      name === "naoConformes" ? "Não Conformes" :
                      name === "realizadas" ? "Realizadas" :
                      name === "previstas" ? "Previstas" : name;
                    return [value, formattedName];
                  }} 
                />
                <Legend 
                  formatter={(value) => {
                    return value === "conformes" ? "Conformes" :
                           value === "naoConformes" ? "Não Conformes" :
                           value === "realizadas" ? "Realizadas" :
                           value === "previstas" ? "Previstas" : value;
                  }} 
                />
                {reportType === "compliance" || reportType === "category" ? (
                  <>
                    <Bar dataKey="conformes" fill="#22c55e" name="Conformes" />
                    <Bar dataKey="naoConformes" fill="#ef4444" name="Não Conformes" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="realizadas" fill="#3b82f6" name="Realizadas" />
                    <Bar dataKey="previstas" fill="#a855f7" name="Previstas" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Principais Métricas</CardTitle>
            <CardDescription>Resumo dos indicadores de qualidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conformidade Geral</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-medium">+5%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inspeções Realizadas</p>
                  <p className="text-2xl font-bold">231/250</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">92%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Não Conformidades Abertas</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-xs font-medium">-3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categoria Crítica</CardTitle>
            <CardDescription>Categoria com maior número de não-conformidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold">Alvenaria</p>
                <div className="text-red-500 bg-red-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  22% não-conformes
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Principais problemas identificados:
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Prumo fora do padrão aceitável</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Juntas irregulares entre blocos</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Fixação inadequada com estrutura</span>
                </li>
              </ul>
              
              <Button variant="secondary" className="w-full">
                Ver Detalhes da Categoria
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
