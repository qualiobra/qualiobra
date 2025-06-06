
import { z } from "zod";

// Lista de ícones permitidos
export const ICONES_DISPONIVEIS = [
  "Sofa",
  "Bed", 
  "Bath",
  "ChefHat",
  "Hotel",
  "Crown",
  "Shirt",
  "WashingMachine",
  "Trees",
  "Car",
  "Monitor",
  "UtensilsCrossed",
  "DoorOpen",
  "Archive"
] as const;

export const comodoFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z.string().optional(),
  icone: z.enum(ICONES_DISPONIVEIS, {
    required_error: "Ícone é obrigatório",
    invalid_type_error: "Ícone inválido"
  })
});

export type ComodoFormData = z.infer<typeof comodoFormSchema>;
