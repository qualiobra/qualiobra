
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
  origem?: 'direto' | 'herdado'; // Adicionar informação sobre a origem
}

export interface ComodoItemInsert {
  comodo_id: string;
  item_id: string;
  obrigatorio?: boolean;
  ordem?: number;
}

export interface ComodoItemUpdate {
  obrigatorio?: boolean;
  ordem?: number;
}
