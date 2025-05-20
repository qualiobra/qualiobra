
import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

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

// Perfis padrão
const defaultRoles: UserRole[] = [
  {
    id: "admin",
    name: "Administrador",
    permissions: ["all"]
  }
];

// Criação do contexto
const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [userRoles, setUserRoles] = useState<UserRole[]>(defaultRoles);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  // Carregar perfis salvos do localStorage
  useEffect(() => {
    const savedRoles = localStorage.getItem("userRoles");
    if (savedRoles) {
      setUserRoles(JSON.parse(savedRoles));
    }

    // Verificar se o usuário atual é um administrador (primeiro usuário)
    if (user) {
      const userRoleMapping = localStorage.getItem("userRoleMapping");
      if (userRoleMapping) {
        const mappings = JSON.parse(userRoleMapping);
        const userRoleId = mappings[user.id];
        if (userRoleId) {
          const role = userRoles.find(r => r.id === userRoleId);
          if (role) {
            setCurrentUserRole(role);
          }
        } else {
          // Se não tem perfil atribuído e é o primeiro usuário, atribui como admin
          const isFirstUser = Object.keys(mappings).length === 0;
          if (isFirstUser) {
            const adminRole = userRoles.find(r => r.id === "admin");
            if (adminRole) {
              setCurrentUserRole(adminRole);
              const newMapping = { [user.id]: "admin" };
              localStorage.setItem("userRoleMapping", JSON.stringify(newMapping));
            }
          }
        }
      } else {
        // Se não existe mapeamento, este é o primeiro usuário (admin)
        const adminRole = userRoles.find(r => r.id === "admin");
        if (adminRole) {
          setCurrentUserRole(adminRole);
          const newMapping = { [user.id]: "admin" };
          localStorage.setItem("userRoleMapping", JSON.stringify(newMapping));
        }
      }
    }
  }, [user, userRoles]);

  // Salvar perfis no localStorage quando atualizados
  useEffect(() => {
    localStorage.setItem("userRoles", JSON.stringify(userRoles));
  }, [userRoles]);

  // Adicionar novo perfil
  const addRole = (role: Omit<UserRole, "id">) => {
    const id = Date.now().toString();
    const newRole = { ...role, id };
    setUserRoles([...userRoles, newRole]);
  };

  // Atualizar perfil existente
  const updateRole = (id: string, roleUpdate: Partial<UserRole>) => {
    setUserRoles(userRoles.map(role => 
      role.id === id ? { ...role, ...roleUpdate } : role
    ));
  };

  // Remover perfil
  const deleteRole = (id: string) => {
    setUserRoles(userRoles.filter(role => role.id !== id));
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
