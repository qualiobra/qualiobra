
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useSupabaseEngenheiros, type SupabaseEngenheiro } from "@/hooks/useSupabaseEngenheiros";
import { Control, FieldPath } from "react-hook-form";

interface SupabaseEngenheiroSelectorProps {
  control: Control<any>;
  name: FieldPath<any>;
  label: string;
  onEngenheiroSelect?: (engenheiro: SupabaseEngenheiro) => void;
}

export const SupabaseEngenheiroSelector = ({ control, name, label, onEngenheiroSelect }: SupabaseEngenheiroSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { engenheiros, isLoading } = useSupabaseEngenheiros();

  const handleSelect = (engenheiro: SupabaseEngenheiro, onChange: (value: string) => void) => {
    onChange(engenheiro.id);
    onEngenheiroSelect?.(engenheiro);
    setOpen(false);
  };

  const getEngenheiroDisplayName = (engenheiroId: string) => {
    const engenheiro = engenheiros.find(e => e.id === engenheiroId);
    if (!engenheiro) return "Selecione um engenheiro";
    
    const nome = `${engenheiro.first_name || ''} ${engenheiro.last_name || ''}`.trim();
    const crea = engenheiro.crea ? ` (CREA: ${engenheiro.crea})` : '';
    return `${nome}${crea}`;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {field.value ? getEngenheiroDisplayName(field.value) : "Selecione um engenheiro"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar engenheiro..." />
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? "Carregando..." : "Nenhum engenheiro encontrado."}
                    </CommandEmpty>
                    <CommandGroup>
                      {engenheiros.map((engenheiro) => {
                        const nomeCompleto = `${engenheiro.first_name || ''} ${engenheiro.last_name || ''}`.trim();
                        const displayText = `${nomeCompleto}${engenheiro.crea ? ` - CREA: ${engenheiro.crea}` : ''}`;
                        
                        return (
                          <CommandItem
                            key={engenheiro.id}
                            value={displayText}
                            onSelect={() => handleSelect(engenheiro, field.onChange)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === engenheiro.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{nomeCompleto}</span>
                              {engenheiro.crea && (
                                <span className="text-sm text-muted-foreground">CREA: {engenheiro.crea}</span>
                              )}
                              {engenheiro.especialidade && (
                                <span className="text-sm text-muted-foreground">{engenheiro.especialidade}</span>
                              )}
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
