
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/hooks/use-toast";
import { useUserRole, UserRole } from "@/context/UserRoleContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus, Users, Settings, MoreVertical, Pencil, Trash2 } from "lucide-react";

const AdminPanel = () => {
  const { user } = useUser();
  const { userRoles, addRole, updateRole, deleteRole } = useUserRole();
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Manipuladores para adicionar e editar perfis
  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome do perfil é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    addRole({
      name: newRoleName,
      permissions: newRolePermissions.length > 0 ? newRolePermissions : ["dashboard"],
    });
    
    setNewRoleName("");
    setNewRolePermissions([]);
    setIsDialogOpen(false);
    
    toast({
      title: "Perfil criado",
      description: `O perfil ${newRoleName} foi criado com sucesso.`,
    });
  };
  
  const handleEditRole = () => {
    if (!editingRole) return;
    
    if (!editingRole.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome do perfil é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    updateRole(editingRole.id, {
      name: editingRole.name,
      permissions: editingRole.permissions,
    });
    
    setEditingRole(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Perfil atualizado",
      description: `O perfil ${editingRole.name} foi atualizado com sucesso.`,
    });
  };
  
  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (roleId === "admin") {
      toast({
        title: "Operação não permitida",
        description: "Não é possível excluir o perfil de Administrador.",
        variant: "destructive",
      });
      return;
    }
    
    deleteRole(roleId);
    
    toast({
      title: "Perfil excluído",
      description: `O perfil ${roleName} foi excluído com sucesso.`,
    });
  };

  const handlePermissionToggle = (permission: string) => {
    if (editingRole) {
      // Modo de edição
      const updatedPermissions = editingRole.permissions.includes(permission)
        ? editingRole.permissions.filter(p => p !== permission)
        : [...editingRole.permissions, permission];
      
      setEditingRole({
        ...editingRole,
        permissions: updatedPermissions,
      });
    } else {
      // Modo de adição
      const updatedPermissions = newRolePermissions.includes(permission)
        ? newRolePermissions.filter(p => p !== permission)
        : [...newRolePermissions, permission];
      
      setNewRolePermissions(updatedPermissions);
    }
  };
  
  // Função para obter status de permissão
  const hasPermission = (permission: string) => {
    if (editingRole) {
      return editingRole.permissions.includes(permission) || editingRole.permissions.includes("all");
    }
    return newRolePermissions.includes(permission) || newRolePermissions.includes("all");
  };
  
  // Resetar estado do diálogo ao fechar
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setEditingRole(null);
      setNewRoleName("");
      setNewRolePermissions([]);
    }
    setIsDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, perfis e configurações do sistema.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="roles">
        <TabsList className="mb-4">
          <TabsTrigger value="roles" className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> Perfis
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" /> Usuários
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Perfis de Acesso</h2>
            
            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Novo Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingRole ? "Editar Perfil de Acesso" : "Adicionar Perfil de Acesso"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingRole 
                      ? "Modifique as informações do perfil de acesso conforme necessário."
                      : "Crie um novo perfil de acesso para usuários do sistema."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="roleName" className="text-sm font-medium">
                      Nome do Perfil
                    </label>
                    <Input 
                      id="roleName"
                      placeholder="Ex: Engenheiro, Inspetor"
                      value={editingRole ? editingRole.name : newRoleName}
                      onChange={(e) => {
                        if (editingRole) {
                          setEditingRole({...editingRole, name: e.target.value});
                        } else {
                          setNewRoleName(e.target.value);
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Permissões</label>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="perm-all" 
                          checked={hasPermission("all")}
                          onChange={() => handlePermissionToggle("all")}
                          className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="perm-all" className="text-sm">
                          Acesso Total (Todas as permissões)
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="perm-dashboard" 
                            checked={hasPermission("dashboard") || hasPermission("all")}
                            onChange={() => handlePermissionToggle("dashboard")}
                            disabled={hasPermission("all")}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="perm-dashboard" className="text-sm">
                            Dashboard
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="perm-inspections" 
                            checked={hasPermission("inspections") || hasPermission("all")}
                            onChange={() => handlePermissionToggle("inspections")}
                            disabled={hasPermission("all")}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="perm-inspections" className="text-sm">
                            Inspeções
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="perm-team" 
                            checked={hasPermission("team") || hasPermission("all")}
                            onChange={() => handlePermissionToggle("team")}
                            disabled={hasPermission("all")}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="perm-team" className="text-sm">
                            Equipe
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="perm-reports" 
                            checked={hasPermission("reports") || hasPermission("all")}
                            onChange={() => handlePermissionToggle("reports")}
                            disabled={hasPermission("all")}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                          />
                          <label htmlFor="perm-reports" className="text-sm">
                            Relatórios
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={editingRole ? handleEditRole : handleAddRole}>
                    {editingRole ? "Salvar Alterações" : "Adicionar Perfil"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        {role.permissions.includes("all") 
                          ? "Acesso Total" 
                          : role.permissions.map(p => 
                              p === "dashboard" ? "Dashboard" :
                              p === "inspections" ? "Inspeções" :
                              p === "team" ? "Equipe" : 
                              p === "reports" ? "Relatórios" : p
                            ).join(", ")}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingRole(role);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteRole(role.id, role.name)}
                              disabled={role.id === "admin"}
                              className={role.id === "admin" ? "text-gray-400" : "text-red-600"}
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
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>
                Gerencie os usuários do sistema e seus perfis de acesso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade de gerenciamento de usuários em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Ajuste as configurações gerais da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade de configurações em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
