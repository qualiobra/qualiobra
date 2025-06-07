
import { useState } from "react";
import { useAuth } from "@/context/SupabaseAuthContext";
import { useSupabaseUsers } from "@/hooks/useSupabaseUsers";
import { useUserInvites } from "@/hooks/useUserInvites";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
import { UserInvitesTable } from "@/components/admin/UserInvitesTable";
import { UserManagementHeader } from "@/components/admin/UserManagementHeader";
import { UsersDataTable } from "@/components/admin/UsersDataTable";
import { useUserManagementActions } from "@/components/admin/UserManagementActions";

const SupabaseUserManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    users, 
    isLoading: usersLoading, 
    createUser, 
    updateUser, 
    deleteUser,
    isCreatingUser,
    refetch
  } = useSupabaseUsers();
  
  const {
    createInvite,
    deleteInvite,
    isCreatingInvite
  } = useUserInvites();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentUserProfile = users.find(u => u.id === user.id);
  const isAdmin = currentUserProfile?.role === 'admin';
  
  // Check admin permissions only after we have user data
  if (!usersLoading && !isAdmin) {
    toast({
      title: "Acesso Restrito",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = user.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });
  
  const {
    editingUser,
    isDialogOpen,
    setIsDialogOpen,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    onSubmit,
    toggleUserStatus,
    handleDeleteUser,
    handleEditUser,
    handleAddUser,
    handleInviteUser,
    handleManualRefresh
  } = useUserManagementActions({
    users,
    updateUser,
    createUser,
    deleteUser,
    refetch
  });

  const handleSendInvite = (email: string, role: string) => {
    createInvite({ email, role });
  };

  const handleDeleteInvite = (inviteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este convite?')) {
      deleteInvite(inviteId);
    }
  };

  // Show loading while users are being fetched
  if (usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserManagementHeader
        isCreatingUser={isCreatingUser}
        onManualRefresh={handleManualRefresh}
        onInviteUser={handleInviteUser}
        onAddUser={handleAddUser}
      />
      
      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        onSubmit={onSubmit}
      />
      
      <InviteUserDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleSendInvite}
        isLoading={isCreatingInvite}
      />
      
      <UserInvitesTable onDeleteInvite={handleDeleteInvite} />
      
      <UsersDataTable
        users={filteredUsers}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEditUser={handleEditUser}
        onToggleStatus={toggleUserStatus}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleAddUser}
        onManualRefresh={handleManualRefresh}
      />
    </div>
  );
};

export default SupabaseUserManagement;
