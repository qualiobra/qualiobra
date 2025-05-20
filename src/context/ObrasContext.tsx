
import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useUserRole } from "./UserRoleContext";
import type { Obra, ObraStatus, NivelPBQPH, ObraUsuario, ObraAnexo } from "../types/obra";

// Tipo para o contexto
type ObrasContextType = {
  obras: Obra[];
  loading: boolean;
  adicionarObra: (obra: Omit<Obra, "id" | "criadaEm" | "criadaPor">) => void;
  atualizarObra: (id: string, obra: Partial<Obra>) => void;
  arquivarObra: (id: string) => void;
  atribuirUsuario: (obraId: string, usuario: ObraUsuario) => void;
  removerUsuario: (obraId: string, userId: string) => void;
  getObrasDoUsuario: () => Obra[];
  // Função para gerar código único para obra
  gerarCodigoObra: () => string;
  criarObra: (novaObra: Omit<Obra, "id">) => void; // Added to match the signature used in NovaObraDialog
};

// Criação do contexto
const ObrasContext = createContext<ObrasContextType | undefined>(undefined);

export const ObrasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const { currentUserRole } = useUserRole();
  const [obras, setObras] = useState<Obra[]>(() => {
    // Inicialização do estado a partir do localStorage
    const savedObras = localStorage.getItem("obras");
    return savedObras ? JSON.parse(savedObras) : [];
  });
  const [loading, setLoading] = useState(false);

  // Efeito para salvar obras no localStorage quando forem atualizadas
  useEffect(() => {
    localStorage.setItem("obras", JSON.stringify(obras));
  }, [obras]);
  
  // Função auxiliar para gerar código único para a obra
  const gerarCodigoObra = () => {
    const anoAtual = new Date().getFullYear();
    const numeroExistente = obras.length > 0 
      ? Math.max(...obras.map(o => {
        const match = o.codigoDaObra?.match(/OBRA-\d{4}-(\d{3})/);
        return match ? parseInt(match[1], 10) : 0;
      }))
      : 0;
    const proximoNumero = (numeroExistente + 1).toString().padStart(3, '0');
    return `OBRA-${anoAtual}-${proximoNumero}`;
  };

  // Adicionar nova obra - renamed to criarObra to match the usage in NovaObraDialog
  const criarObra = (obraData: Omit<Obra, "id">) => {
    if (!user) return;
    
    const novaObra: Obra = {
      ...obraData,
      id: Date.now().toString(),
    };
    
    setObras(prevObras => [...prevObras, novaObra]);
  };

  // Atualizar obra existente
  const atualizarObra = (id: string, obraUpdate: Partial<Obra>) => {
    setObras(prevObras => 
      prevObras.map(obra => obra.id === id ? { ...obra, ...obraUpdate } : obra)
    );
  };

  // Arquivar obra
  const arquivarObra = (id: string) => {
    atualizarObra(id, { status: "arquivada" });
  };

  // Atribuir usuário a uma obra
  const atribuirUsuario = (obraId: string, usuario: ObraUsuario) => {
    setObras(prevObras => 
      prevObras.map(obra => {
        if (obra.id === obraId) {
          // Verifica se o usuário já existe e atualiza, ou adiciona novo
          const usuarioExistente = obra.usuarios.findIndex(u => u.userId === usuario.userId);
          let novosUsuarios;
          
          if (usuarioExistente >= 0) {
            novosUsuarios = [...obra.usuarios];
            novosUsuarios[usuarioExistente] = usuario;
          } else {
            novosUsuarios = [...obra.usuarios, usuario];
          }
          
          return { ...obra, usuarios: novosUsuarios };
        }
        return obra;
      })
    );
  };

  // Remover usuário de uma obra
  const removerUsuario = (obraId: string, userId: string) => {
    setObras(prevObras => 
      prevObras.map(obra => {
        if (obra.id === obraId) {
          return {
            ...obra,
            usuarios: obra.usuarios.filter(u => u.userId !== userId)
          };
        }
        return obra;
      })
    );
  };

  // Obter obras do usuário atual
  const getObrasDoUsuario = () => {
    if (!user) return [];
    
    // Administradores veem todas as obras
    if (currentUserRole?.id === "admin") {
      return obras;
    }
    
    // Outros usuários veem apenas as obras às quais estão atribuídos
    return obras.filter(obra => 
      obra.usuarios.some(u => u.userId === user.id)
    );
  };

  // Use adicionarObra as an alias for criarObra for backward compatibility
  const adicionarObra = criarObra;

  return (
    <ObrasContext.Provider
      value={{
        obras,
        loading,
        adicionarObra,
        atualizarObra,
        arquivarObra,
        atribuirUsuario,
        removerUsuario,
        getObrasDoUsuario,
        gerarCodigoObra,
        criarObra
      }}
    >
      {children}
    </ObrasContext.Provider>
  );
};

export const useObras = () => {
  const context = useContext(ObrasContext);
  if (context === undefined) {
    throw new Error("useObras deve ser usado dentro de um ObrasProvider");
  }
  return context;
};
