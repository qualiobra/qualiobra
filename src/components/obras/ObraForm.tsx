
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ObraDatePicker } from "./ObraDatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useObras } from "@/hooks/useObras";
import { useState } from "react";
import { FileUp } from "lucide-react";
import { obraFormSchema, type ObraFormValues } from "./ObraFormSchema";
import { NivelPBQPH } from "@/context/ObrasContext";

interface ObraFormProps {
  defaultValues?: Partial<ObraFormValues>;
  onSubmit: (values: ObraFormValues) => void;
  submitButtonText: string;
  isEdit?: boolean;
}

export default function ObraForm({ defaultValues, onSubmit, submitButtonText, isEdit = false }: ObraFormProps) {
  const { gerarCodigoObra } = useObras();
  const [anexos, setAnexos] = useState<Array<{nome: string, url: string, tipo: string}>>(defaultValues?.anexosObra || []);
  
  // Generate a new code only for new obras
  const codigoObra = !isEdit ? gerarCodigoObra() : defaultValues?.codigoDaObra || "";

  // Use defaultValues or provide initial empty values
  const initialValues: Partial<ObraFormValues> = {
    codigoDaObra: codigoObra,
    nome: "",
    descricao: "",
    localizacao: "",
    cepCodigoPostal: "",
    dataInicio: new Date(),
    dataPrevistaTermino: undefined,
    status: "planejamento",
    nivelPBQPH: "Não Aplicável",
    documentos: [],
    anexosObra: [],
    responsavelEngenheiroNome: "",
    responsavelEngenheiroEmail: "",
    responsavelEngenheiroTelefone: "",
    observacoesGerais: "",
    ...defaultValues,
  };

  const form = useForm<ObraFormValues>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: initialValues,
  });

  const handleAnexoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simular upload de arquivos (em uma aplicação real, isso seria feito para um servidor)
      const novosAnexos = Array.from(e.target.files).map(file => {
        // Criar uma URL temporária para o arquivo
        const url = URL.createObjectURL(file);
        return {
          nome: file.name,
          url: url,
          tipo: file.type
        };
      });
      
      setAnexos([...anexos, ...novosAnexos]);
      
      // Atualizar o campo anexosObra no formulário
      form.setValue('anexosObra', [...anexos, ...novosAnexos], { shouldValidate: true });
    }
  };

  const removerAnexo = (index: number) => {
    const novosAnexos = [...anexos];
    novosAnexos.splice(index, 1);
    setAnexos(novosAnexos);
    form.setValue('anexosObra', novosAnexos, { shouldValidate: true });
  };

  const handleSubmit = (values: ObraFormValues) => {
    const valuesWithAnexos = {
      ...values,
      anexosObra: anexos
    };
    onSubmit(valuesWithAnexos);
  };

  const niveisOptions: NivelPBQPH[] = ["Nível A", "Nível B", "Não Aplicável"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigoDaObra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código da Obra</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: OBRA-2025-001" {...field} readOnly={!isEdit} className={!isEdit ? "bg-gray-100" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="cepCodigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="CEP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <ObraDatePicker control={form.control} name="dataInicio" label="Data de Início" />
            )}
          />

          <FormField
            control={form.control}
            name="dataPrevistaTermino"
            render={({ field }) => (
              <ObraDatePicker control={form.control} name="dataPrevistaTermino" label="Data Prevista de Término" />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="suspensa">Suspensa</SelectItem>
                    <SelectItem value="arquivada">Arquivada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nivelPBQPH"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível PBQP-H</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível PBQP-H" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {niveisOptions.map((nivel) => (
                      <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="responsavelEngenheiroNome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Engenheiro Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do engenheiro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsavelEngenheiroEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email do Engenheiro</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsavelEngenheiroTelefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone do Engenheiro</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacoesGerais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Gerais</FormLabel>
              <FormControl>
                <Textarea placeholder="Observações adicionais sobre a obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Anexos</FormLabel>
          <div className="border rounded-md p-4">
            <div className="flex flex-col space-y-2">
              <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                <FileUp className="mr-2 h-5 w-5" />
                <span>Clique para fazer upload de arquivos</span>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleAnexoChange}
                />
              </label>
              
              {anexos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Arquivos anexados:</h4>
                  <ul className="space-y-2">
                    {anexos.map((anexo, index) => (
                      <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <span className="text-sm">{anexo.nome}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(anexo.url, '_blank')}
                          >
                            Visualizar
                          </Button>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removerAnexo(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">{submitButtonText}</Button>
        </div>
      </form>
    </Form>
  );
}
