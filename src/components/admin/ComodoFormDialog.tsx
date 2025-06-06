
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { comodoFormSchema, ComodoFormData, ICONES_DISPONIVEIS } from "./schemas/comodoFormSchema";
import { ComodoMaster } from "@/types/comodoTypes";
import * as LucideIcons from "lucide-react";

interface ComodoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ComodoFormData) => void;
  comodo?: ComodoMaster | null;
  isLoading?: boolean;
}

export const ComodoFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  comodo,
  isLoading = false,
}: ComodoFormDialogProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  const form = useForm<ComodoFormData>({
    resolver: zodResolver(comodoFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      icone: "Sofa" as any,
    },
  });

  // Reset form when comodo changes or dialog opens
  useEffect(() => {
    if (open) {
      if (comodo) {
        form.reset({
          nome: comodo.nome,
          descricao: comodo.descricao || "",
          icone: comodo.icone as any,
        });
        setSelectedIcon(comodo.icone);
      } else {
        form.reset({
          nome: "",
          descricao: "",
          icone: "Sofa" as any,
        });
        setSelectedIcon("Sofa");
      }
    }
  }, [comodo, open, form]);

  const handleSubmit = (data: ComodoFormData) => {
    console.log("Submitting comodo form:", data);
    onSubmit(data);
    if (!comodo) {
      form.reset();
      setSelectedIcon("Sofa");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setSelectedIcon("Sofa");
  };

  // Renderizar ícone dinamicamente
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />;
    }
    return <LucideIcons.Home className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {comodo ? "Editar Cômodo" : "Novo Cômodo"}
          </DialogTitle>
          <DialogDescription>
            {comodo
              ? "Edite as informações do cômodo master."
              : "Adicione um novo cômodo master ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Sala de Estar" {...field} />
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
                      placeholder="Descrição opcional do cômodo..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedIcon(value);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ícone">
                          {selectedIcon && (
                            <div className="flex items-center gap-2">
                              {renderIcon(selectedIcon)}
                              <span>{selectedIcon}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ICONES_DISPONIVEIS.map((icone) => (
                        <SelectItem key={icone} value={icone}>
                          <div className="flex items-center gap-2">
                            {renderIcon(icone)}
                            <span>{icone}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : comodo ? "Salvar Alterações" : "Criar Cômodo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
