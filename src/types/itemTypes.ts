
export interface ItemInspecionavel {
  id: string;
  nome: string;
  descricao: string | null;
  categoria_id: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriaItem {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemInspecionavelInsert {
  nome: string;
  descricao?: string;
  categoria_id: string;
  ativo?: boolean;
}

export interface ItemInspecionavelUpdate {
  nome?: string;
  descricao?: string;
  categoria_id?: string;
  ativo?: boolean;
}

export interface CategoriaItemInsert {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface CategoriaItemUpdate {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}
