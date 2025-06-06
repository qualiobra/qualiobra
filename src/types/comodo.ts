
export type ComodoTipologia = {
  id: string;
  tipologia_id: string;
  comodo_master_id?: string | null;
  nome: string;
  descricao?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateComodoData = {
  tipologia_id: string;
  comodo_master_id?: string | null;
  nome: string;
  descricao?: string;
};

export type UpdateComodoData = {
  id: string;
  comodo_master_id?: string | null;
  nome?: string;
  descricao?: string;
};
