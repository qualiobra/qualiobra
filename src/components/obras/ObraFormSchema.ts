
import { z } from "zod";

export const obraFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  descricao: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  localizacao: z.string().min(5, { message: "A localização deve ter pelo menos 5 caracteres" }),
  dataInicio: z.date({ required_error: "Data de início é obrigatória" }),
  status: z.enum(["planejamento", "em_andamento", "concluida", "suspensa", "arquivada"], {
    required_error: "Status é obrigatório",
  }),
  documentos: z.array(z.string()).optional().default([]),
});

export type ObraFormValues = z.infer<typeof obraFormSchema>;
