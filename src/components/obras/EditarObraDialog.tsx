
import React, { useEffect } from "react";
import { useObras } from "@/context/ObrasContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StatusObra } from "@/types/obra";

const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome da obra deve ter pelo menos 3 caracteres",
  }),
  descricao: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  localizacao: z.string().min(5, {
    message: "A localização deve ter pelo menos 5 caracteres",
  }),
  dataInicio: z.date({
    required_error: "A data de início é obrigatória",
  }),
  status: z.enum(["em_andamento", "concluida", "paralisada", "arquivada"]),
});

type EditarObraFormValues = z.infer<typeof formSchema>;

interface EditarObraDialogProps {
  obraId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarObraDialog({ obraId, open, onOpenChange }: EditarObraDialogProps) {
  const { obras, atualizarObra } = useObras();
  const obra = obras.find(o => o.id === obraId);
  
  const form = useForm<EditarObraFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      localizacao: "",
      status: "em_andamento",
    }
  });
  
  // Preencher formulário quando a obra for encontrada
  useEffect(() => {
    if (obra) {
      form.reset({
        nome: obra.nome,
        descricao: obra.descricao,
        localizacao: obra.localizacao,
        dataInicio: new Date(obra.dataInicio),
        status: obra.status,
      });
    }
  }, [obra, form]);

  function onSubmit(data: EditarObraFormValues) {
    if (!obra) return;
    
    atualizarObra(obraId, {
      ...data,
      dataInicio: data.dataInicio.toISOString(),
    });
    
    toast({
      title: "Obra atualizada",
      description: `Os dados da obra "${data.nome}" foram atualizados com sucesso.`,
    });
    
    onOpenChange(false);
  }
  
  if (!obra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Obra</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Obra</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea 
                      {...field} 
                      className="min-h-[100px]"
                    />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ptBR}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="em_andamento">Em andamento</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="paralisada">Paralisada</SelectItem>
                        <SelectItem value="arquivada">Arquivada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
