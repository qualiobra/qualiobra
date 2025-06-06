
export type Tipologia = {
  id: string;
  obra_id: string;
  nome: string;
  metragem?: number | null;
  descricao?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTipologiaData = {
  obra_id: string;
  nome: string;
  metragem?: number;
  descricao?: string;
};

export type UpdateTipologiaData = {
  id: string;
  nome?: string;
  metragem?: number;
  descricao?: string;
};
