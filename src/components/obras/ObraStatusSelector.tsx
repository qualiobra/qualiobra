
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

interface ObraStatusSelectorProps {
  name: string;
  label: string;
}

export function ObraStatusSelector({ name, label }: ObraStatusSelectorProps) {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
  );
}
