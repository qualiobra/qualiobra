
export type ComodoTipologia = {
  id: string;
  tipologia_id: string;
  nome: string;
  descricao?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateComodoData = {
  tipologia_id: string;
  nome: string;
  descricao?: string;
};

export type UpdateComodoData = {
  id: string;
  nome?: string;
  descricao?: string;
};
