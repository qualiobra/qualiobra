
import { z } from "zod";
import { StatusObra } from "@/types/obra";

export const obraFormSchema = z.object({
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

export type ObraFormValues = z.infer<typeof obraFormSchema>;
