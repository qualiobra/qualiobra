
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ObraStatus } from "@/context/ObrasContext";
import { Control } from "react-hook-form";
import { type ObraFormValues } from "./ObraFormSchema";

interface ObraStatusSelectorProps {
  control: Control<ObraFormValues>;
}

export function ObraStatusSelector({ control }: ObraStatusSelectorProps) {
  const statusOptions: { label: string; value: ObraStatus }[] = [
    { label: "Planejamento", value: "planejamento" },
    { label: "Em andamento", value: "em_andamento" },
    { label: "Concluída", value: "concluida" },
    { label: "Suspensa", value: "suspensa" },
    { label: "Arquivada", value: "arquivada" },
  ];

  return (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select name="status">
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
