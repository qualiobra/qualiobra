
import { useState, useEffect } from "react";
import { useUserRole } from "@/context/UserRoleContext";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  UserPlus, 
  User, 
  Users, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  ShieldCheck,
  Mail
} from "lucide-react";

// Dados mockados para simular usuários do sistema
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  avatar?: string;
  status: "active" | "inactive";
  lastLogin: string | null;
}

// Schema de validação para o formulário de usuário
const userFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  roleId: z.string({
    required_error: "Por favor, selecione um perfil.",
  }),
  avatar: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

const UserManagement = () => {
  const { currentUserRole, userRoles } = useUserRole();
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "Admin Teste",
      email: "admin@teste.com",
      role: "Administrador",
      roleId: "admin",
      avatar: "",
      status: "active",
      lastLogin: "20/05/2025 10:30"
    },
    {
      id: "2",
      name: "João Silva",
      email: "joao@empresa.com",
      role: "Engenheiro",
      roleId: "eng1",
      avatar: "",
      status: "active",
      lastLogin: "18/05/2025 14:15"
    },
    {
      id: "3",
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "Inspetor",
      roleId: "insp1",
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

  // Configurar o formulário com React Hook Form
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
      avatar: "",
      status: "active",
    },
  });

  // Atualizar o formulário quando um usuário estiver sendo editado
  useEffect(() => {
    if (editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        password: "", // Não preencher senha na edição
        roleId: editingUser.roleId,
        avatar: editingUser.avatar || "",
        status: editingUser.status,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        roleId: "",
        avatar: "",
        status: "active",
      });
    }
  }, [editingUser, form]);

  // Função para lidar com o envio do formulário
  const onSubmit = (values: z.infer<typeof userFormSchema>) => {
    if (editingUser) {
      // Atualizar usuário existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: values.name, 
              email: values.email,
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

  // Obter as iniciais do nome para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{editingUser ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={editingUser ? "Deixe em branco para manter" : "Senha temporária"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfil</FormLabel>
                        <FormControl>
                          <select
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            {...field}
                          >
                            <option value="" disabled>Selecione um perfil</option>
                            {userRoles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem de Perfil (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                  <Button type="submit">
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
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin || "Nunca acessou"}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          <ShieldCheck className="mr-2 h-4 w-4" /> 
                          {user.status === "active" ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => resendInvitation(user.id)}>
                          <Mail className="mr-2 h-4 w-4" /> Reenviar Convite
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => deleteUser(user.id)}
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

export default UserManagement;
