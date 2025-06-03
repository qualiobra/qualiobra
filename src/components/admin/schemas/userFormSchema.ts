
import * as z from "zod";

export const userFormSchema = z.object({
  firstName: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  lastName: z.string().min(1, {
    message: "Sobrenome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  telefone: z.string().optional(),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }).optional(),
  role: z.string({
    required_error: "Por favor, selecione um perfil.",
  }),
  isEngenheiro: z.boolean().default(false),
  crea: z.string().optional(),
  especialidade: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type UserFormData = z.infer<typeof userFormSchema>;
