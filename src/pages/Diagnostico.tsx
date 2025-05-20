
import React, { useState } from "react";
import { DiagnosticoSession } from "@/components/diagnostico/DiagnosticoSession";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useObras } from "@/hooks/useObras";
import { ChevronRight, ClipboardCheck, Building } from "lucide-react";

export default function Diagnostico() {
  const [selectedTab, setSelectedTab] = useState<string>("novo");
  const [selectedNivel, setSelectedNivel] = useState<"Nível A" | "Nível B">("Nível B");
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);
  const [startedDiagnostic, setStartedDiagnostic] = useState(false);
  
  const { obras } = useObras();

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

  if (startedDiagnostic) {
    return <DiagnosticoSession nivelDiagnostico={selectedNivel} obraId={selectedObraId || undefined} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico Inicial de Conformidade</h1>
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
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnóstico para Obra Específica</CardTitle>
                <CardDescription>
                  Avalie a conformidade em uma obra específica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="obra" className="text-sm font-medium">
                      Selecione a Obra
                    </label>
                    <Select onValueChange={(value) => setSelectedObraId(value)}>
                      <SelectTrigger id="obra">
                        <SelectValue placeholder="Selecione uma obra" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {obras.map((obra) => (
                          <SelectItem key={obra.id} value={obra.id}>
                            {obra.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="nivel" className="text-sm font-medium">
                      Nível do Diagnóstico
                    </label>
                    <Select 
                      defaultValue={selectedNivel} 
                      onValueChange={(value) => setSelectedNivel(value as "Nível A" | "Nível B")}
                    >
                      <SelectTrigger id="nivel">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Nível B">Nível B</SelectItem>
                        <SelectItem value="Nível A">Nível A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setStartedDiagnostic(true)}
                  disabled={!selectedObraId}
                >
                  <Building className="mr-2 h-4 w-4" /> Iniciar Diagnóstico de Obra
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnóstico Geral</CardTitle>
                <CardDescription>
                  Avalie a conformidade de forma geral para empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Um diagnóstico geral não está vinculado a uma obra específica.
                    Útil para avaliações de sistemas corporativos ou para criar uma linha base.
                  </p>
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="nivel-geral" className="text-sm font-medium">
                      Nível do Diagnóstico
                    </label>
                    <Select 
                      defaultValue={selectedNivel} 
                      onValueChange={(value) => setSelectedNivel(value as "Nível A" | "Nível B")}
                    >
                      <SelectTrigger id="nivel-geral">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Nível B">Nível B</SelectItem>
                        <SelectItem value="Nível A">Nível A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setStartedDiagnostic(true)}
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Iniciar Diagnóstico Geral
                </Button>
              </CardFooter>
            </Card>
          </div>
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
