
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useObras } from "@/hooks/useObras";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ObrasList() {
  const { obrasDoUsuario, carregando } = useObras();
  
  // Ordenar obras: Em andamento primeiro, depois os outros status
  const sortedObras = [...obrasDoUsuario].sort((a, b) => {
    if (a.status === "em_andamento" && b.status !== "em_andamento") {
      return -1;
    }
    if (a.status !== "em_andamento" && b.status === "em_andamento") {
      return 1;
    }
    return 0;
  });

  const formatStatus = (status: string) => {
    switch (status) {
      case "em_andamento":
        return { label: "Em andamento", className: "bg-blue-500" };
      case "concluida":
        return { label: "Concluída", className: "bg-green-500" };
      case "paralisada":
        return { label: "Paralisada", className: "bg-amber-500" };
      case "arquivada":
        return { label: "Arquivada", className: "bg-gray-400" };
      default:
        return { label: status, className: "" };
    }
  };

  if (carregando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Obras</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Obras</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {obrasDoUsuario.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Você não está associado a nenhuma obra no momento.
          </p>
        ) : (
          <div className="space-y-1">
            {sortedObras.slice(0, 5).map((obra) => {
              const status = formatStatus(obra.status);
              
              return (
                <div
                  key={obra.id}
                  className={cn(
                    "flex items-center justify-between px-4 py-2 text-sm rounded-md",
                    obra.status === "arquivada" ? "opacity-70" : ""
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{obra.nome}</span>
                    <span className="text-xs text-muted-foreground">{obra.localizacao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{status.label}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => window.location.href = `/obras/${obra.id}`}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {obrasDoUsuario.length > 5 && (
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => window.location.href = "/obras"}
              >
                Ver todas ({obrasDoUsuario.length})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
