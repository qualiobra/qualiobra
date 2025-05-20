
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function DiagnosticosList() {
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

  return (
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
  );
}
