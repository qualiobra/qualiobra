
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, RolePermission, UserRoleAssignment } from "@/types/roles";

export const useSupabaseRoles = () => {
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['supabase-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('is_active', true)
        .order('display_name');
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      return data as UserRole[];
    },
  });

  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }
      
      return data as RolePermission[];
    },
  });

  return {
    roles,
    permissions,
    isLoading: rolesLoading || permissionsLoading,
  };
};

export const useUserRoleAssignments = (userId?: string) => {
  return useQuery({
    queryKey: ['user-role-assignments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_role_assignments')
        .select(`
          *,
          user_roles!inner(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching user role assignments:', error);
        throw error;
      }
      
      return data as (UserRoleAssignment & { user_roles: UserRole })[];
    },
    enabled: !!userId,
  });
};

export const useUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_role_assignments')
        .select(`
          user_roles!inner(
            role_permissions(module, action)
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching user permissions:', error);
        throw error;
      }
      
      // Flatten permissions from all roles
      const permissions = data.flatMap(assignment => 
        assignment.user_roles.role_permissions || []
      );
      
      return permissions;
    },
    enabled: !!userId,
  });
};
