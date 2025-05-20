
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
};
