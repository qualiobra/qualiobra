
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  UserPlus, 
  User, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  ShieldCheck,
  Mail
} from "lucide-react";

// Schema de validação para o formulário de usuário
const userFormSchema = z.object({
  firstName: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  lastName: z.string().min(1, {
    message: "Sobrenome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  telefone: z.string().optional(),
  role: z.string({
    required_error: "Por favor, selecione um perfil.",
  }),
  crea: z.string().optional(),
  especialidade: z.string().optional(),
  isEngenheiro: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});

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
    isDeletingUser
  } = useSupabaseUsers();
  
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Verificar se o usuário atual é admin (implementação básica)
  const currentUserProfile = users.find(u => u.id === user?.id);
  const isAdmin = currentUserProfile?.role === 'admin';
  
  // Se não for administrador, redirecionar para o dashboard
  if (!isLoading && !isAdmin) {
    toast({
      title: "Acesso Restrito",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Configurar o formulário com React Hook Form
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      telefone: "",
      role: "",
      crea: "",
      especialidade: "",
      isEngenheiro: false,
      status: "active",
    },
  });

  // Atualizar o formulário quando um usuário estiver sendo editado
  useEffect(() => {
    if (editingUser) {
      form.reset({
        firstName: editingUser.first_name || "",
        lastName: editingUser.last_name || "",
        email: editingUser.email || "",
        telefone: editingUser.telefone || "",
        role: editingUser.role || "user",
        crea: editingUser.crea || "",
        especialidade: editingUser.especialidade || "",
        isEngenheiro: editingUser.is_engenheiro || false,
        status: editingUser.status as "active" | "inactive" || "active",
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        telefone: "",
        role: "",
        crea: "",
        especialidade: "",
        isEngenheiro: false,
        status: "active",
      });
    }
  }, [editingUser, form]);

  // Função para lidar com o envio do formulário
  const onSubmit = (values: z.infer<typeof userFormSchema>) => {
    console.log('Submitting user form with values:', values);
    
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser} disabled={isCreatingUser}>
              <UserPlus className="mr-2 h-4 w-4" /> 
              {isCreatingUser ? "Criando..." : "Novo Usuário"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuário" : "Criar Novo Usuário"}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? "Edite as informações do usuário conforme necessário."
                  : "Preencha os detalhes para criar um novo usuário no sistema."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input placeholder="Sobrenome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@exemplo.com" 
                          {...field} 
                          disabled={!!editingUser}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone/WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+55 00 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfil</FormLabel>
                        <FormControl>
                          <select
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            {...field}
                          >
                            <option value="" disabled>Selecione um perfil</option>
                            <option value="admin">Administrador</option>
                            <option value="user">Usuário</option>
                            <option value="engenheiro">Engenheiro</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="isEngenheiro"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>É engenheiro</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("isEngenheiro") && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="crea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CREA</FormLabel>
                          <FormControl>
                            <Input placeholder="CREA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="especialidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Especialidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {editingUser && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            {...field}
                          >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isCreatingUser || isUpdatingUser}>
                    {editingUser ? "Salvar Alterações" : "Criar Usuário"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Lista de todos os usuários registrados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseUserManagement;
