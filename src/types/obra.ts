
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

// Interfaces para o sistema de avaliação PBQP-H
export interface QuestaoAvaliacao {
  id: string;
  requisito: string;
  item: string;
  descricao: string;
  tipoResposta: 'escala' | 'simNao';
  observacoes?: string;
}

export interface RespostaAvaliacao {
  questaoId: string;
  valor: number; // 1-5 para escala, 1/5 para sim/não
  observacoes?: string;
}

export interface SecaoAvaliacao {
  id: string;
  titulo: string;
  subtitulo?: string;
  questoes: QuestaoAvaliacao[];
}

export interface AvaliacaoPBQPH {
  id: string;
  usuarioId: string;
  dataInicio: string;
  dataConclusao?: string;
  respostas: RespostaAvaliacao[];
  concluida: boolean;
  resultadoGeral?: number;
  resultadosPorSecao?: Record<string, number>;
}

export interface LeadCadastro {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  empresa: string;
  porteEmpresa: 'micro' | 'pequena' | 'media' | 'grande';
  numeroObras: string;
  segmentoAtuacao: string;
  interesseEmCertificacao: boolean;
  emailVerificado?: boolean;
  codigoVerificacao?: string;
}
