
import { useState } from "react";

export type EnderecoViaCep = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export const useCepLookup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const buscarEnderecoPorCep = async (cep: string): Promise<EnderecoViaCep | null> => {
    if (!cep || cep.length !== 8) return null;

    setIsLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { buscarEnderecoPorCep, isLoading };
};
