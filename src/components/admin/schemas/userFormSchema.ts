
import * as z from "zod";

export const userFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  telefoneWhatsApp: z.string().optional(),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }).optional(),
  roleId: z.string({
    required_error: "Por favor, selecione um perfil.",
  }),
  avatar: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type UserFormData = z.infer<typeof userFormSchema>;
