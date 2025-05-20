
import React, { useState, useEffect } from "react";
import { useUserRole } from "@/context/UserRoleContext";
import { useObras } from "@/hooks/useObras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { ChevronRight, ClipboardCheck, Building, Save } from "lucide-react";
import { QuestaoDiagnostico, RespostaOpcao } from "@/types/diagnostico";
import { DiagnosticoForm } from "@/components/diagnostico/DiagnosticoForm";
import { DiagnosticosList } from "@/components/diagnostico/DiagnosticosList";

// Componente para Diagnóstico de Conformidade Inicial
export default function Diagnostico() {
  const { currentUserRole } = useUserRole();
  const [selectedTab, setSelectedTab] = useState<string>("novo");
  
  // Verificar permissões do usuário
  const isAuthorized = currentUserRole && 
    (currentUserRole.id === "admin" || 
     currentUserRole.id === "engenheiro_gestor");

  // Se não autorizado, mostrar mensagem
  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico de Conformidade Inicial</h1>
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
          <DiagnosticoForm />
        </TabsContent>

        <TabsContent value="salvos">
          <DiagnosticosList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
