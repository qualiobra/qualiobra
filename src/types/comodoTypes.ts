
export interface ComodoMaster {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComodoMasterInsert {
  nome: string;
  descricao?: string;
  icone: string;
  ativo?: boolean;
}

export interface ComodoMasterUpdate {
  nome?: string;
  descricao?: string;
  icone?: string;
  ativo?: boolean;
}
