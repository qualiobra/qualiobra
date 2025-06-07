// Type definitions for Obra-related data structures
export type ObraStatus = "planejamento" | "em_andamento" | "concluida" | "suspensa" | "arquivada";
export type NivelPBQPH = "Nível A" | "Nível B" | "Não Aplicável";

export type ObraUsuario = {
  userId: string;
  nome: string;
  email: string;
  funcao: string;
  roleId: string; // Role ID for permission system
  telefoneWhatsApp?: string; // Optional WhatsApp phone number
};

export type ObraAnexo = {
  nome: string;
  url: string;
  tipo: string;
};

export type Obra = {
  id: string;
  nome: string;
  codigoDaObra: string;
  descricao: string;
  localizacao: string;
  status: ObraStatus;
  dataInicio: string;
  dataPrevistaTermino: string;
  nivelPBQPH: NivelPBQPH;
  usuarios: ObraUsuario[];
  anexosObra?: ObraAnexo[];
  
  // Campos de endereço expandidos
  cepCodigoPostal?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  
  // Campos do engenheiro responsável
  responsavelEngenheiroId?: string;
  responsavelEngenheiroNome?: string;
  responsavelEngenheiroEmail?: string;
  responsavelEngenheiroTelefone?: string;
  responsavelEngenheiroCrea?: string;
  
  documentos?: string[];
  observacoesGerais?: string;
};

/**
 * Generates a unique project code for a new obra (construction project).
 * 
 * The function creates codes in the format: OBRA-YYYY-NNN where:
 * - OBRA is a fixed prefix
 * - YYYY is the current year (4 digits)
 * - NNN is a sequential number padded to 3 digits (001, 002, etc.)
 * 
 * The function ensures uniqueness by finding the highest existing number
 * for the current year and incrementing it by 1.
 * 
 * @returns {string} A unique project code (e.g., "OBRA-2024-001", "OBRA-2024-015")
 * 
 * @example
 * // If no projects exist for 2024
 * gerarCodigoObra(); // Returns "OBRA-2024-001"
 * 
 * @example
 * // If projects OBRA-2024-001 through OBRA-2024-005 already exist
 * gerarCodigoObra(); // Returns "OBRA-2024-006"
 */
export function gerarCodigoObra(): string;
