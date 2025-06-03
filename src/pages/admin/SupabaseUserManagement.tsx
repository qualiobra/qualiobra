import { useState, useEffect } from "react";
import { useAuth } from "@/context/SupabaseAuthContext";
import { useSupabaseUsers, type Profile } from "@/hooks/useSupabaseUsers";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { UserFormData } from "@/components/admin/schemas/userFormSchema";

const SupabaseUserManagement = () => {
  const { user } = useAuth();
  const { 
    users, 
    isLoading, 
    createUser, 
    updateUser, 
    deleteUser,
    isCreatingUser,
    isUpdatingUser,
    refetch
  } = useSupabaseUsers();
  
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastUserCount, setLastUserCount] = useState(0);
  
  // Verificar se o usuário atual é admin
  const currentUserProfile = users.find(u => u.id === user?.id);
  const isAdmin = currentUserProfile?.role === 'admin';
  
  // Monitor changes in user count
  useEffect(() => {
    if (users.length !== lastUserCount) {
      console.log(`👥 Lista de usuários atualizada: ${lastUserCount} → ${users.length} usuários`);
      setLastUserCount(users.length);
    }
  }, [users.length, lastUserCount]);
  
  // Se não for administrador, redirecionar para o dashboard
  if (!isLoading && !isAdmin) {
    toast({
      title: "Acesso Restrito",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Função para lidar com o envio do formulário
  const onSubmit = (values: UserFormData) => {
    console.log('=== SUBMETENDO FORMULÁRIO DE USUÁRIO ===');
    console.log('Valores do formulário:', values);
    console.log('Usuários atuais na lista:', users.length);
    
    if (editingUser) {
      // Atualizar usuário existente
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
      // Criar novo usuário
      console.log('Criando novo usuário...');
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
    
    // Fechar o diálogo e limpar o estado de edição
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // Função para alternar o status do usuário
  const toggleUserStatus = (userProfile: Profile) => {
    const newStatus = userProfile.status === "active" ? "inactive" : "active";
    updateUser({
      id: userProfile.id,
      status: newStatus
    });
  };

  // Função para deletar um usuário
  const handleDeleteUser = (userProfile: Profile) => {
    const userName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) {
      deleteUser(userProfile.id);
    }
  };

  // Função para abrir o diálogo de edição
  const handleEditUser = (userProfile: Profile) => {
    setEditingUser(userProfile);
    setIsDialogOpen(true);
  };

  // Função para abrir o diálogo de criação
  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  // Função para refresh manual
  const handleManualRefresh = async () => {
    console.log('🔄 Refresh manual iniciado...');
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

  // Obter as iniciais do nome para o fallback do avatar
  const getInitials = (profile: Profile) => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  if (isLoading) {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema, suas funções e permissões.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleManualRefresh}
            title="Atualizar lista"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddUser} disabled={isCreatingUser}>
            <UserPlus className="mr-2 h-4 w-4" /> 
            {isCreatingUser ? "Criando..." : "Novo Usuário"}
          </Button>
        </div>
      </div>
      
      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        onSubmit={onSubmit}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema ({users.length})</CardTitle>
          <CardDescription>
            Lista de todos os usuários registrados no sistema.
            {users.length > 0 && (
              <span className="block mt-1 text-sm text-green-600">
                ✅ {users.length} usuário(s) encontrado(s)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum usuário encontrado</p>
              <div className="space-y-2">
                <Button onClick={handleAddUser}>
                  <UserPlus className="mr-2 h-4 w-4" /> Criar Primeiro Usuário
                </Button>
                <Button variant="outline" onClick={handleManualRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Atualizar Lista
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engenheiro</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{getInitials(userProfile)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {`${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Sem nome'}
                    </TableCell>
                    <TableCell>{userProfile.email || '-'}</TableCell>
                    <TableCell>{userProfile.telefone || "-"}</TableCell>
                    <TableCell>{userProfile.role || 'user'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userProfile.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {userProfile.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {userProfile.is_engenheiro ? (
                        <span className="text-green-600">Sim</span>
                      ) : (
                        <span className="text-gray-500">Não</span>
                      )}
                      {userProfile.crea && (
                        <div className="text-xs text-gray-500">CREA: {userProfile.crea}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditUser(userProfile)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(userProfile)}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> 
                            {userProfile.status === "active" ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteUser(userProfile)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseUserManagement;
