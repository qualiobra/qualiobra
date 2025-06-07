
export type AppRole = 'admin' | 'engenheiro_rt' | 'mestre_obras' | 'trabalhador' | 'fornecedor' | 'cliente' | 'auditor';

export type AppModule = 'usuarios' | 'obras' | 'fornecedores' | 'inspections' | 'reports' | 'diagnostico' | 'admin';

export type AppAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'audit';

export interface UserRole {
  id: string;
  name: AppRole;
  display_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  module: AppModule;
  action: AppAction;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by: string | null;
  assigned_at: string;
  is_active: boolean;
}

export interface UserWithRoles {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  roles: UserRole[];
  permissions: {
    module: AppModule;
    action: AppAction;
  }[];
}
