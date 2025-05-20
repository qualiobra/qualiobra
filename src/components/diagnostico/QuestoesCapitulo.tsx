
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestaoDiagnostico, RespostaOpcao } from "@/types/diagnostico";

interface QuestoesCapituloProps {
  capitulo: string;
  questoes: QuestaoDiagnostico[];
  selectedNivel: "Nível A" | "Nível B";
  respostas: Record<string, { 
    resposta: RespostaOpcao | null;
    justificativa: string;
  }>;
  onRespostaChange: (questaoId: string, valor: RespostaOpcao) => void;
  onJustificativaChange: (questaoId: string, valor: string) => void;
}

export function QuestoesCapitulo({
  capitulo,
  questoes,
  selectedNivel,
  respostas,
  onRespostaChange,
  onJustificativaChange
}: QuestoesCapituloProps) {
  return (
    <Card key={capitulo} className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle>{capitulo}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {questoes.map((questao) => (
            <div key={questao.IDQuestao} className="border-b pb-6 last:border-0 last:pb-0">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm text-muted-foreground mb-1">
                    {questao.SubItemRequisito}
                  </p>
                  <p className="text-base">{questao.DescricaoQuestao}</p>
                  
                  {/* Exibir exigência conforme o nível */}
                  {selectedNivel === "Nível B" && questao.ExigenciaNivelB && (
                    <p className="mt-2 text-sm bg-blue-50 p-2 rounded border border-blue-100">
                      <span className="font-semibold">Exigência Nível B:</span> {questao.ExigenciaNivelB}
                    </p>
                  )}
                  
                  {selectedNivel === "Nível A" && questao.ExigenciaNivelA && (
                    <p className="mt-2 text-sm bg-purple-50 p-2 rounded border border-purple-100">
                      <span className="font-semibold">Exigência Nível A:</span> {questao.ExigenciaNivelA}
                    </p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`resposta-${questao.IDQuestao}`}>Avaliação</Label>
                    <Select 
                      value={respostas[questao.IDQuestao]?.resposta || ""} 
                      onValueChange={(value) => onRespostaChange(questao.IDQuestao, value as RespostaOpcao)}
                    >
                      <SelectTrigger id={`resposta-${questao.IDQuestao}`}>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Atende Totalmente">Atende Totalmente</SelectItem>
                        <SelectItem value="Atende Parcialmente">Atende Parcialmente</SelectItem>
                        <SelectItem value="Não Atende">Não Atende</SelectItem>
                        <SelectItem value="Não se Aplica">Não se Aplica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`justificativa-${questao.IDQuestao}`}>Justificativa/Evidências</Label>
                    <Textarea 
                      id={`justificativa-${questao.IDQuestao}`}
                      placeholder="Registre as evidências ou justificativas para sua avaliação"
                      value={respostas[questao.IDQuestao]?.justificativa || ""}
                      onChange={(e) => onJustificativaChange(questao.IDQuestao, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
