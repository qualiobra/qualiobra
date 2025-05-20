
import { useContext } from 'react';
import { ObrasContext } from '../context/ObrasContext';

export const useObras = () => {
  const context = useContext(ObrasContext);
  if (context === undefined) {
    throw new Error("useObras deve ser usado dentro de um ObrasProvider");
  }
  return context;
};
