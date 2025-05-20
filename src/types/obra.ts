
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  fotoPerfil?: string;
}

export interface UsuarioObra {
  usuario: Usuario;
  funcao: string;
}

export type StatusObra = 'em_andamento' | 'concluida' | 'paralisada' | 'arquivada';

export interface Obra {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  dataInicio: string;
  status: StatusObra;
  documentos: Documento[];
  usuarios: UsuarioObra[];
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  dataUpload: string;
}
