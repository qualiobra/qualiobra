
import { z } from "zod";

export const obraFormSchema = z.object({
  codigoDaObra: z.string().min(1, { message: "Código da obra é obrigatório" }),
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  descricao: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  localizacao: z.string().min(1, { message: "Localização é obrigatória" }),
  
  // Campos de endereço expandidos
  cepCodigoPostal: z.string().min(8, { message: "CEP deve ter 8 dígitos" }).max(8),
  logradouro: z.string().min(1, { message: "Logradouro é obrigatório" }),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().min(1, { message: "Bairro é obrigatório" }),
  cidade: z.string().min(1, { message: "Cidade é obrigatória" }),
  estado: z.string().min(2, { message: "Estado é obrigatório" }).max(2),
  
  dataInicio: z.date({ required_error: "Data de início é obrigatória" }),
  dataPrevistaTermino: z.date().optional(),
  status: z.enum(["planejamento", "em_andamento", "concluida", "suspensa", "arquivada"], {
    required_error: "Status é obrigatório",
  }),
  nivelPBQPH: z.enum(["Nível A", "Nível B", "Não Aplicável"], {
    required_error: "Nível PBQP-H é obrigatório",
  }).default("Não Aplicável"),
  
  // Campos do engenheiro responsável
  responsavelEngenheiroId: z.string().min(1, { message: "Engenheiro responsável é obrigatório" }),
  responsavelEngenheiroNome: z.string().optional(),
  responsavelEngenheiroEmail: z.string().optional(),
  responsavelEngenheiroTelefone: z.string().optional(),
  responsavelEngenheiroCrea: z.string().optional(),
  
  documentos: z.array(z.string()).optional().default([]),
  anexosObra: z.array(
    z.object({
      nome: z.string(),
      url: z.string(),
      tipo: z.string()
    })
  ).optional().default([]),
  observacoesGerais: z.string().optional(),
});

export type ObraFormValues = z.infer<typeof obraFormSchema>;
