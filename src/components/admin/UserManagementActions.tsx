
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/hooks/useSupabaseUsers";
import { UserFormData } from "@/components/admin/schemas/userFormSchema";

interface UserManagementActionsProps {
  users: Profile[];
  updateUser: (userData: any) => void;
  createUser: (userData: any) => void;
  deleteUser: (userId: string) => void;
  refetch: () => Promise<any>;
}

export const useUserManagementActions = ({
  users,
  updateUser,
  createUser,
  deleteUser,
  refetch
}: UserManagementActionsProps) => {
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const onSubmit = (values: UserFormData) => {
    console.log('Form submitted with values:', values);
    
    if (editingUser) {
      updateUser({
        id: editingUser.id,
        first_name: values.firstName,
        last_name: values.lastName,
        telefone: values.telefone,
        role: values.role,
        crea: values.crea,
        especialidade: values.especialidade,
        is_engenheiro: values.isEngenheiro,
        status: values.status,
      });
    } else {
      createUser({
        email: values.email,
        role: values.role,
        first_name: values.firstName,
        last_name: values.lastName,
        telefone: values.telefone,
        crea: values.crea,
        especialidade: values.especialidade,
        is_engenheiro: values.isEngenheiro,
      });
    }
    
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const toggleUserStatus = (userProfile: Profile) => {
    const newStatus = userProfile.status === "active" ? "inactive" : "active";
    updateUser({
      id: userProfile.id,
      status: newStatus
    });
  };

  const handleDeleteUser = (userProfile: Profile) => {
    const userName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) {
      deleteUser(userProfile.id);
    }
  };

  const handleEditUser = (userProfile: Profile) => {
    console.log('Editing user:', userProfile);
    setEditingUser(userProfile);
    setIsDialogOpen(true);
  };

  const handleAddUser = () => {
    console.log('Adding new user');
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleInviteUser = () => {
    setIsInviteDialogOpen(true);
  };

  const handleManualRefresh = async () => {
    toast({
      title: "Atualizando lista",
      description: "Buscando usuários mais recentes...",
    });
    
    try {
      await refetch();
      toast({
        title: "Lista atualizada",
        description: `${users.length} usuários encontrados.`,
      });
    } catch (error) {
      console.error('Erro no refresh manual:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a lista de usuários.",
        variant: "destructive",
      });
    }
  };

  return {
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
    handleManualRefresh,
    setEditingUser
  };
};
