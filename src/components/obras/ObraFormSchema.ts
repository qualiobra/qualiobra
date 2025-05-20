
import { z } from "zod";

export const obraFormSchema = z.object({
  codigoDaObra: z.string().min(1, { message: "Código da obra é obrigatório" }),
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  descricao: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  localizacao: z.string().min(5, { message: "A localização deve ter pelo menos 5 caracteres" }),
  cepCodigoPostal: z.string().optional(),
  dataInicio: z.date({ required_error: "Data de início é obrigatória" }),
  dataPrevistaTermino: z.date().optional(),
  status: z.enum(["planejamento", "em_andamento", "concluida", "suspensa", "arquivada"], {
    required_error: "Status é obrigatório",
  }),
  nivelPBQPH: z.enum(["Nível A", "Nível B", "Não Aplicável"], {
    required_error: "Nível PBQP-H é obrigatório",
  }).default("Não Aplicável"),
  documentos: z.array(z.string()).optional().default([]),
  anexosObra: z.array(
    z.object({
      nome: z.string(),
      url: z.string(),
      tipo: z.string()
    })
  ).optional().default([]),
  responsavelEngenheiroNome: z.string().min(3, { message: "Nome do engenheiro responsável é obrigatório" }),
  responsavelEngenheiroEmail: z.string().email({ message: "Email inválido" }).optional(),
  responsavelEngenheiroTelefone: z.string().optional(),
  observacoesGerais: z.string().optional(),
});

export type ObraFormValues = z.infer<typeof obraFormSchema>;
