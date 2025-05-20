
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ObraDatePicker } from "./ObraDatePicker";
import { ObraStatusSelector } from "./ObraStatusSelector";
import { type Obra } from "@/context/ObrasContext";
import { obraFormSchema, type ObraFormValues } from "./ObraFormSchema";

interface ObraFormProps {
  defaultValues?: Partial<ObraFormValues>;
  onSubmit: (values: ObraFormValues) => void;
  submitButtonText: string;
}

export default function ObraForm({ defaultValues, onSubmit, submitButtonText }: ObraFormProps) {
  // Use defaultValues or provide initial empty values
  const initialValues: Partial<ObraFormValues> = defaultValues || {
    nome: "",
    descricao: "",
    localizacao: "",
    dataInicio: new Date(),
    status: "planejamento",
    documentos: [],
  };

  const form = useForm<ObraFormValues>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: ObraFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva a obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="localizacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input placeholder="Endereço da obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataInicio"
          render={({ field }) => (
            <ObraDatePicker control={form.control} name="dataInicio" label="Data de Início" />
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  {...field}
                >
                  <option value="planejamento">Planejamento</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluida">Concluída</option>
                  <option value="suspensa">Suspensa</option>
                  <option value="arquivada">Arquivada</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: Implementar upload de documentos em uma versão futura */}

        <div className="flex justify-end pt-4">
          <Button type="submit">{submitButtonText}</Button>
        </div>
      </form>
    </Form>
  );
}
