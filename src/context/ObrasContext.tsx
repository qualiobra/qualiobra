
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Obra, Usuario, UsuarioObra, StatusObra } from "../types/obra";
import { useUserRole } from "./UserRoleContext";
import { useUser } from "@clerk/clerk-react";

interface ObrasContextType {
  obras: Obra[];
  obrasDoUsuario: Obra[];
  obraAtual: Obra | null;
  carregando: boolean;
  erro: string | null;
  adicionarObra: (obra: Omit<Obra, "id">) => void;
  atualizarObra: (id: string, obra: Partial<Obra>) => void;
  arquivarObra: (id: string) => void;
  atribuirUsuario: (obraId: string, usuario: Usuario, funcao: string) => void;
  removerUsuario: (obraId: string, usuarioId: string) => void;
  selecionarObra: (id: string | null) => void;
  adicionarDocumento: (obraId: string, documento: Omit<Documento, "id" | "dataUpload">) => void;
  removerDocumento: (obraId: string, documentoId: string) => void;
}

const ObrasContext = createContext<ObrasContextType | undefined>(undefined);

// Dados de exemplo para obras
const obrasIniciais: Obra[] = [
  {
    id: "1",
    nome: "Edifício Residence Park",
    descricao: "Construção de edifício residencial com 12 andares",
    localizacao: "Av. Paulista, 1000 - São Paulo/SP",
    dataInicio: "2023-10-15",
    status: "em_andamento",
    documentos: [
      {
        id: "doc1",
        nome: "Planta baixa",
        tipo: "pdf",
        url: "/documentos/planta.pdf",
        dataUpload: "2023-10-15"
      }
    ],
    usuarios: []
  },
  {
    id: "2",
    nome: "Reforma Hospital Santa Casa",
    descricao: "Reforma da ala pediátrica",
    localizacao: "Rua das Flores, 500 - Rio de Janeiro/RJ",
    dataInicio: "2023-09-01",
    status: "em_andamento",
    documentos: [],
    usuarios: []
  }
];

export const ObrasProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [obras, setObras] = useState<Obra[]>(obrasIniciais);
  const [obraAtual, setObraAtual] = useState<Obra | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const { user } = useUser();
  const { currentUserRole } = useUserRole();
  
  // Filtra as obras que o usuário atual tem acesso
  const obrasDoUsuario = React.useMemo(() => {
    // Se for admin, vê todas as obras
    if (currentUserRole?.permissions.includes('all')) {
      return obras;
    }
    
    // Caso contrário, só vê as obras em que está atribuído
    if (!user) return [];
    
    return obras.filter(obra => 
      obra.usuarios.some(u => u.usuario.id === user.id)
    );
  }, [obras, user, currentUserRole]);

  const adicionarObra = (novaObra: Omit<Obra, "id">) => {
    const id = Date.now().toString();
    setObras(prev => [...prev, { id, ...novaObra }]);
  };

  const atualizarObra = (id: string, dadosAtualizados: Partial<Obra>) => {
    setObras(prev => prev.map(obra => 
      obra.id === id ? { ...obra, ...dadosAtualizados } : obra
    ));
  };

  const arquivarObra = (id: string) => {
    atualizarObra(id, { status: 'arquivada' });
  };

  const atribuirUsuario = (obraId: string, usuario: Usuario, funcao: string) => {
    setObras(prev => prev.map(obra => {
      if (obra.id !== obraId) return obra;
      
      // Remove o usuário se já existir e adiciona com a nova função
      const usuariosAtualizados = obra.usuarios
        .filter(u => u.usuario.id !== usuario.id)
        .concat({ usuario, funcao });
        
      return { ...obra, usuarios: usuariosAtualizados };
    }));
  };

  const removerUsuario = (obraId: string, usuarioId: string) => {
    setObras(prev => prev.map(obra => {
      if (obra.id !== obraId) return obra;
      
      return {
        ...obra,
        usuarios: obra.usuarios.filter(u => u.usuario.id !== usuarioId)
      };
    }));
  };

  const selecionarObra = (id: string | null) => {
    if (!id) {
      setObraAtual(null);
      return;
    }
    
    const obra = obras.find(o => o.id === id) || null;
    setObraAtual(obra);
  };

  const adicionarDocumento = (obraId: string, documento: Omit<Documento, "id" | "dataUpload">) => {
    const novoDocumento = {
      ...documento,
      id: Date.now().toString(),
      dataUpload: new Date().toISOString().split('T')[0]
    };

    setObras(prev => prev.map(obra => {
      if (obra.id !== obraId) return obra;
      
      return {
        ...obra,
        documentos: [...obra.documentos, novoDocumento]
      };
    }));
  };

  const removerDocumento = (obraId: string, documentoId: string) => {
    setObras(prev => prev.map(obra => {
      if (obra.id !== obraId) return obra;
      
      return {
        ...obra,
        documentos: obra.documentos.filter(d => d.id !== documentoId)
      };
    }));
  };

  // Simulação de carregamento inicial
  useEffect(() => {
    setCarregando(true);
    // Em um cenário real, aqui fariamos uma chamada à API
    setTimeout(() => {
      // Adicionar usuário atual a uma obra para testar
      if (user) {
        const usuarioAtual: Usuario = {
          id: user.id,
          nome: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0]?.emailAddress || ""
        };
        
        const obrasComUsuario = [...obrasIniciais];
        obrasComUsuario[0].usuarios.push({ 
          usuario: usuarioAtual, 
          funcao: "Engenheiro responsável" 
        });
        
        setObras(obrasComUsuario);
      }
      
      setCarregando(false);
    }, 1000);
  }, [user]);

  return (
    <ObrasContext.Provider
      value={{
        obras,
        obrasDoUsuario,
        obraAtual,
        carregando,
        erro,
        adicionarObra,
        atualizarObra,
        arquivarObra,
        atribuirUsuario,
        removerUsuario,
        selecionarObra,
        adicionarDocumento,
        removerDocumento
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
