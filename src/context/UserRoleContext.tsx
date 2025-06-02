
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./SupabaseAuthContext";

// Tipos para perfis de usuário
export type UserRole = {
  id: string;
  name: string;
  permissions: string[];
};

// Tipo para o contexto
type UserRoleContextType = {
  userRoles: UserRole[];
  currentUserRole: UserRole | null;
  addRole: (role: Omit<UserRole, "id">) => void;
  updateRole: (id: string, role: Partial<UserRole>) => void;
  deleteRole: (id: string) => void;
  setUserRole: (userId: string, roleId: string) => void;
};

// Perfis padrão - atualizados para QualiObra
const defaultRoles: UserRole[] = [
  {
    id: "admin",
    name: "Administrador QualiObra",
    permissions: ["all"]
  },
  {
    id: "engenheiro_gestor",
    name: "Engenheiro Gestor de Obra",
    permissions: [
      "dashboard_own", 
      "obras_crud_own", 
      "formularios_inspecao_crud", 
      "nao_conformidades_crud_own", 
      "inspecoes_approve_own", 
      "view_dashboards_own"
    ]
  },
  {
    id: "equipe_inspecao",
    name: "Equipe de Inspeção",
    permissions: [
      "obras_view_own", 
      "inspecoes_submit", 
      "inspecoes_view_own", 
      "gamification_view"
    ]
  }
];

// Criação do contexto
const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>(() => {
    // Inicialização do estado a partir do localStorage
    const savedRoles = localStorage.getItem("userRoles");
    return savedRoles ? JSON.parse(savedRoles) : defaultRoles;
  });
  
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Função para carregar o perfil do usuário atual
  const loadCurrentUserRole = useCallback(() => {
    if (!user) return;

    const userRoleMapping = localStorage.getItem("userRoleMapping");
    let mappings = userRoleMapping ? JSON.parse(userRoleMapping) : {};
    
    // Verificar se o usuário tem um perfil atribuído
    if (Object.keys(mappings).includes(user.id)) {
      const userRoleId = mappings[user.id];
      const role = userRoles.find(r => r.id === userRoleId);
      if (role) {
        setCurrentUserRole(role);
      }
    } else {
      // Se não tem perfil atribuído, é o primeiro usuário (admin)
      const adminRole = userRoles.find(r => r.id === "admin");
      if (adminRole) {
        setCurrentUserRole(adminRole);
        mappings[user.id] = "admin";
        localStorage.setItem("userRoleMapping", JSON.stringify(mappings));
      }
    }
    
    setInitialized(true);
  }, [user, userRoles]);

  // Efeito para carregar o perfil do usuário quando o componente montar
  // ou quando o usuário ou perfis mudarem
  useEffect(() => {
    if (!initialized || !user) return;
    
    loadCurrentUserRole();
  }, [user, initialized, loadCurrentUserRole]);

  // Efeito para inicializar o contexto quando o componente montar
  useEffect(() => {
    if (!initialized && user) {
      loadCurrentUserRole();
    }
  }, [initialized, user, loadCurrentUserRole]);

  // Efeito para salvar perfis no localStorage quando forem atualizados
  useEffect(() => {
    localStorage.setItem("userRoles", JSON.stringify(userRoles));
  }, [userRoles]);

  // Adicionar novo perfil
  const addRole = (role: Omit<UserRole, "id">) => {
    const id = Date.now().toString();
    const newRole = { ...role, id };
    setUserRoles(prevRoles => [...prevRoles, newRole]);
  };

  // Atualizar perfil existente
  const updateRole = (id: string, roleUpdate: Partial<UserRole>) => {
    setUserRoles(prevRoles => 
      prevRoles.map(role => role.id === id ? { ...role, ...roleUpdate } : role)
    );
  };

  // Remover perfil
  const deleteRole = (id: string) => {
    setUserRoles(prevRoles => prevRoles.filter(role => role.id !== id));
  };

  // Atribuir perfil a um usuário
  const setUserRole = (userId: string, roleId: string) => {
    const userRoleMapping = localStorage.getItem("userRoleMapping");
    const mappings = userRoleMapping ? JSON.parse(userRoleMapping) : {};
    mappings[userId] = roleId;
    localStorage.setItem("userRoleMapping", JSON.stringify(mappings));
    
    // Atualizar perfil atual se for o usuário logado
    if (user && user.id === userId) {
      const role = userRoles.find(r => r.id === roleId);
      if (role) {
        setCurrentUserRole(role);
      }
    }
  };

  return (
    <UserRoleContext.Provider
      value={{
        userRoles,
        currentUserRole,
        addRole,
        updateRole,
        deleteRole,
        setUserRole
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole deve ser usado dentro de um UserRoleProvider");
  }
  return context;
};
