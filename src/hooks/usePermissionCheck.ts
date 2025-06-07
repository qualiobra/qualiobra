
import { useUserPermissions } from "./useSupabaseRoles";
import { AppModule, AppAction } from "@/types/roles";

export const usePermissionCheck = (userId?: string) => {
  const { data: permissions = [] } = useUserPermissions(userId);

  const hasPermission = (module: AppModule, action: AppAction): boolean => {
    return permissions.some(
      permission => permission.module === module && permission.action === action
    );
  };

  const isAdmin = (): boolean => {
    // Admin has all permissions, check for admin module access
    return hasPermission('admin', 'read');
  };

  const canManageUsers = (): boolean => {
    return hasPermission('usuarios', 'create') || hasPermission('usuarios', 'update');
  };

  const canViewReports = (): boolean => {
    return hasPermission('reports', 'read');
  };

  const canManageObras = (): boolean => {
    return hasPermission('obras', 'create') || hasPermission('obras', 'update');
  };

  return {
    hasPermission,
    isAdmin,
    canManageUsers,
    canViewReports,
    canManageObras,
    permissions,
  };
};
