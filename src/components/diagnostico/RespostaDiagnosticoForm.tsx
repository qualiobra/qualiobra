
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { QuestaoDiagnostico, RespostaOpcao } from "@/types/diagnostico";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Esquema de validação para o formulário
const formSchema = z.object({
  respostaUsuario: z.enum(["Atende Totalmente", "Atende Parcialmente", "Não Atende", "Não se Aplica"] as const, {
    required_error: "Por favor, selecione uma resposta",
  }),
  justificativaEvidencias: z.string().optional(),
});

type RespostaDiagnosticoFormProps = {
  questao: QuestaoDiagnostico;
  nivelDiagnostico: "Nível A" | "Nível B";
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
  defaultValues?: {
    respostaUsuario?: RespostaOpcao;
    justificativaEvidencias?: string;
  };
};

export function RespostaDiagnosticoForm({
  questao,
  nivelDiagnostico,
  onSubmit,
  onCancel,
  defaultValues = {}
}: RespostaDiagnosticoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      respostaUsuario: defaultValues.respostaUsuario,
      justificativaEvidencias: defaultValues.justificativaEvidencias || "",
    },
  });

  // Determina qual exigência mostrar com base no nível do diagnóstico
  const exigenciaMostrar = nivelDiagnostico === "Nível A" 
    ? questao.ExigenciaNivelA 
    : questao.ExigenciaNivelB;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">
              {questao.CapituloRequisito}
              {questao.SubItemRequisito ? ` - ${questao.SubItemRequisito}` : ""}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">
              {questao.ReferencialNormativo} • {nivelDiagnostico}
              {questao.GrupoQuestao && ` • ${questao.GrupoQuestao}`}
            </CardDescription>
          </div>
          <div className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
            Questão {questao.OrdemExibicao}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Descrição da Questão:</h3>
            <p className="text-sm text-gray-700">{questao.DescricaoQuestao}</p>
          </div>

          {exigenciaMostrar && (
            <div>
              <h3 className="font-medium mb-2">Exigência para {nivelDiagnostico}:</h3>
              <p className="text-sm text-gray-700">{exigenciaMostrar}</p>
            </div>
          )}

          <Separator className="my-4" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="respostaUsuario"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Avaliação de Conformidade:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Atende Totalmente" id="r1" />
                          <Label htmlFor="r1" className="font-normal">
                            Atende Totalmente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Atende Parcialmente" id="r2" />
                          <Label htmlFor="r2" className="font-normal">
                            Atende Parcialmente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Não Atende" id="r3" />
                          <Label htmlFor="r3" className="font-normal">
                            Não Atende
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Não se Aplica" id="r4" />
                          <Label htmlFor="r4" className="font-normal">
                            Não se Aplica
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="justificativaEvidencias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificativa e Evidências (opcional):</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva evidências que suportam sua avaliação ou justifique sua resposta..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Você pode detalhar como chegou a esta conclusão e incluir referências a documentos ou observações.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-between px-0">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                )}
                <Button type="submit">Salvar e Continuar</Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
