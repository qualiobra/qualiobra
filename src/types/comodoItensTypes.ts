
// Tipos para itens dos cômodos master (padrão)
export interface ComodoMasterItem {
  id: string;
  comodo_master_id: string;
  item_id: string;
  obrigatorio: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ComodoMasterItemWithDetails extends ComodoMasterItem {
  item_nome: string;
  item_descricao: string | null;
  categoria_nome: string;
}

// Tipos para itens específicos dos cômodos de tipologia
export interface ComodoTipologiaItem {
  id: string;
  comodo_tipologia_id: string;
  item_id: string;
  obrigatorio: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ComodoTipologiaItemWithDetails extends ComodoTipologiaItem {
  item_nome: string;
  item_descricao: string | null;
  categoria_nome: string;
}

// Tipo unificado para exibição (substitui ComodoItemWithDetails)
export interface ComodoItemUnified {
  id: string;
  item_id: string;
  obrigatorio: boolean;
  ordem: number;
  item_nome: string;
  item_descricao: string | null;
  categoria_nome: string;
  origem: 'direto' | 'herdado';
}

// Tipos para inserção
export interface ComodoMasterItemInsert {
  comodo_master_id: string;
  item_id: string;
  obrigatorio?: boolean;
  ordem?: number;
}

export interface ComodoTipologiaItemInsert {
  comodo_tipologia_id: string;
  item_id: string;
  obrigatorio?: boolean;
  ordem?: number;
}

// Tipos para atualização
export interface ComodoItemUpdate {
  obrigatorio?: boolean;
  ordem?: number;
}

// Manter compatibilidade com código existente (deprecated)
export interface ComodoItem {
  id: string;
  comodo_id: string;
  item_id: string;
  obrigatorio: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ComodoItemWithDetails extends ComodoItem {
  item_nome: string;
  item_descricao: string | null;
  categoria_nome: string;
  origem?: 'direto' | 'herdado';
}

export interface ComodoItemInsert {
  comodo_id: string;
  item_id: string;
  obrigatorio?: boolean;
  ordem?: number;
}
