
import { z } from "zod";

export const itemFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z.string().optional(),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
});

export const categoriaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z.string().optional(),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;
export type CategoriaFormData = z.infer<typeof categoriaFormSchema>;
