
import { useState } from "react";
import { useUserRole } from "@/context/UserRoleContext";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserData } from "@/types/user";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserFormData } from "@/components/admin/schemas/userFormSchema";

const UserManagement = () => {
  const { currentUserRole, userRoles } = useUserRole();
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "Admin Teste",
      email: "admin@teste.com",
      telefoneWhatsApp: "+55 11 99999-9999",
      role: "Administrador QualiObra",
      roleId: "admin",
      avatar: "",
      status: "active",
      lastLogin: "20/05/2025 10:30"
    },
    {
      id: "2",
      name: "João Silva",
      email: "joao@empresa.com",
      telefoneWhatsApp: "+55 11 98888-8888",
      role: "Engenheiro Gestor de Obra",
      roleId: "engenheiro_gestor",
      avatar: "",
      status: "active",
      lastLogin: "18/05/2025 14:15"
    },
    {
      id: "3",
      name: "Maria Santos",
      email: "maria@empresa.com",
      telefoneWhatsApp: "",
      role: "Equipe de Inspeção",
      roleId: "equipe_inspecao",
      avatar: "",
      status: "inactive",
      lastLogin: null
    }
  ]);
  
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Verificar se o usuário atual tem permissão de administrador
  const isAdmin = currentUserRole?.permissions.includes("all") || false;
  
  // Se não for administrador, redirecionar para o dashboard
  if (!isAdmin) {
    toast({
      title: "Acesso Restrito",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Função para lidar com o envio do formulário
  const handleFormSubmit = (values: UserFormData) => {
    if (editingUser) {
      // Atualizar usuário existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: values.name, 
              email: values.email,
              telefoneWhatsApp: values.telefoneWhatsApp,
              roleId: values.roleId,
              role: userRoles.find(r => r.id === values.roleId)?.name || user.role,
              status: values.status,
              ...(values.avatar ? { avatar: values.avatar } : {})
            } 
          : user
      ));
      
      toast({
        title: "Usuário Atualizado",
        description: `O usuário ${values.name} foi atualizado com sucesso.`,
      });
    } else {
      // Criar novo usuário
      const newUser: UserData = {
        id: Date.now().toString(),
        name: values.name,
        email: values.email,
        telefoneWhatsApp: values.telefoneWhatsApp,
        roleId: values.roleId,
        role: userRoles.find(r => r.id === values.roleId)?.name || "Usuário",
        avatar: values.avatar,
        status: values.status,
        lastLogin: null
      };
      
      setUsers([...users, newUser]);
      
      // Simulação de envio de email
      toast({
        title: "Convite Enviado",
        description: `Um email de convite foi enviado para ${values.email}.`,
      });
    }
    
    // Fechar o diálogo e limpar o estado de edição
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // Função para alternar o status do usuário
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" } 
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === "active" ? "inativo" : "ativo";
    
    toast({
      title: "Status Atualizado",
      description: `O usuário ${user?.name} agora está ${newStatus}.`,
    });
  };

  // Função para deletar um usuário
  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Confirmar antes de deletar
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: "Usuário Excluído",
        description: `O usuário ${user.name} foi removido com sucesso.`,
      });
    }
  };

  // Função para reenviar o convite de um usuário
  const resendInvitation = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    toast({
      title: "Convite Reenviado",
      description: `Um novo convite foi enviado para ${user.email}.`,
    });
  };

  // Função para abrir o diálogo de edição
  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  // Função para abrir o diálogo de criação
  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema, suas funções e permissões.
          </p>
        </div>
        
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Lista de todos os usuários registrados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onEditUser={handleEditUser}
            onToggleStatus={toggleUserStatus}
            onDeleteUser={deleteUser}
            onResendInvitation={resendInvitation}
          />
        </CardContent>
      </Card>

      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        userRoles={userRoles}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default UserManagement;
