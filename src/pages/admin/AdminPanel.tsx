import { useState } from "react";
import { useAuth } from "@/context/SupabaseAuthContext";
import { toast } from "@/hooks/use-toast";
import { useUserRole, UserRole } from "@/context/UserRoleContext";
import { useComodosAdmin } from "@/hooks/admin/useComodosAdmin";
import { useItensAdmin } from "@/hooks/admin/useItensAdmin";
import { ComodoFormDialog } from "@/components/admin/ComodoFormDialog";
import { ComodosAdminTable } from "@/components/admin/ComodosAdminTable";
import { CategoriaFormDialog } from "@/components/admin/CategoriaFormDialog";
import { ItemFormDialog } from "@/components/admin/ItemFormDialog";
import { CategoriasAdminTable } from "@/components/admin/CategoriasAdminTable";
import { ItensAdminTable } from "@/components/admin/ItensAdminTable";
import { ComodoFormData } from "@/components/admin/schemas/comodoFormSchema";
import { ItemFormData, CategoriaFormData } from "@/components/admin/schemas/itemFormSchema";
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
import { UserPlus, Users, Settings, MoreVertical, Pencil, Trash2, User, Home, Package, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();
  const { userRoles, addRole, updateRole, deleteRole } = useUserRole();
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estados para gerenciamento de cômodos
  const {
    comodos,
    isLoading: isLoadingComodos,
    createComodo,
    updateComodo,
    toggleComodoStatus,
    isCreating,
    isUpdating,
    isTogglingStatus,
  } = useComodosAdmin();
  
  const [isComodoDialogOpen, setIsComodoDialogOpen] = useState(false);
  const [editingComodo, setEditingComodo] = useState<any>(null);

  // Estados para gerenciamento de itens
  const {
    categorias,
    itens,
    isLoadingCategorias,
    isLoadingItens,
    createCategoria,
    createItem,
    updateCategoria,
    updateItem,
    toggleCategoriaStatus,
    toggleItemStatus,
    isCreatingCategoria,
    isCreatingItem,
    isUpdatingCategoria,
    isUpdatingItem,
    isTogglingCategoriaStatus,
    isTogglingItemStatus,
  } = useItensAdmin();

  const [isCategoriaDialogOpen, setIsCategoriaDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
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

  // Manipuladores para cômodos
  const handleCreateComodo = (data: ComodoFormData) => {
    createComodo(data);
    setIsComodoDialogOpen(false);
  };

  const handleEditComodo = (comodo: any) => {
    setEditingComodo(comodo);
    setIsComodoDialogOpen(true);
  };

  const handleUpdateComodo = (data: ComodoFormData) => {
    if (editingComodo) {
      updateComodo({ id: editingComodo.id, data });
      setIsComodoDialogOpen(false);
      setEditingComodo(null);
    }
  };

  const handleCloseComodoDialog = () => {
    setIsComodoDialogOpen(false);
    setEditingComodo(null);
  };

  const handleToggleComodoStatus = (id: string, ativo: boolean) => {
    toggleComodoStatus({ id, ativo });
  };

  // Manipuladores para categorias
  const handleCreateCategoria = (data: CategoriaFormData) => {
    createCategoria(data);
    setIsCategoriaDialogOpen(false);
  };

  const handleEditCategoria = (categoria: any) => {
    setEditingCategoria(categoria);
    setIsCategoriaDialogOpen(true);
  };

  const handleUpdateCategoria = (data: CategoriaFormData) => {
    if (editingCategoria) {
      updateCategoria({ id: editingCategoria.id, data });
      setIsCategoriaDialogOpen(false);
      setEditingCategoria(null);
    }
  };

  const handleCloseCategoriaDialog = () => {
    setIsCategoriaDialogOpen(false);
    setEditingCategoria(null);
  };

  const handleToggleCategoriaStatus = (id: string, ativo: boolean) => {
    toggleCategoriaStatus({ id, ativo });
  };

  // Manipuladores para itens
  const handleCreateItem = (data: ItemFormData) => {
    createItem(data);
    setIsItemDialogOpen(false);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  };

  const handleUpdateItem = (data: ItemFormData) => {
    if (editingItem) {
      updateItem({ id: editingItem.id, data });
      setIsItemDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleCloseItemDialog = () => {
    setIsItemDialogOpen(false);
    setEditingItem(null);
  };

  const handleToggleItemStatus = (id: string, ativo: boolean) => {
    toggleItemStatus({ id, ativo });
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
              <div className="flex justify-center py-6">
                <Link to="/admin/user-management">
                  <Button className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Gerenciar Usuários
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Ajuste as configurações gerais da plataforma.
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="geral" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="comodos">Cômodos</TabsTrigger>
              <TabsTrigger value="itens">Itens</TabsTrigger>
            </TabsList>

            <TabsContent value="geral">
              <Card>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Funcionalidade de configurações em desenvolvimento.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comodos" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gerenciar Cômodos Master</h2>
                
                <Button onClick={() => setIsComodoDialogOpen(true)}>
                  <Home className="mr-2 h-4 w-4" /> Novo Cômodo
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cômodos Master</CardTitle>
                  <CardDescription>
                    Cadastro global de tipos de cômodos para o sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComodosAdminTable
                    comodos={comodos}
                    isLoading={isLoadingComodos}
                    onEdit={handleEditComodo}
                    onToggleStatus={handleToggleComodoStatus}
                    isTogglingStatus={isTogglingStatus}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itens" className="space-y-4">
              <Tabs defaultValue="categorias" className="mt-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="categorias">Categorias</TabsTrigger>
                  <TabsTrigger value="itens-lista">Itens Inspecionáveis</TabsTrigger>
                </TabsList>

                <TabsContent value="categorias" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Categorias de Itens</h3>
                    
                    <Button onClick={() => setIsCategoriaDialogOpen(true)}>
                      <Tag className="mr-2 h-4 w-4" /> Nova Categoria
                    </Button>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Categorias</CardTitle>
                      <CardDescription>
                        Gerencie as categorias de itens inspecionáveis.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CategoriasAdminTable
                        categorias={categorias}
                        isLoading={isLoadingCategorias}
                        onEdit={handleEditCategoria}
                        onToggleStatus={handleToggleCategoriaStatus}
                        isTogglingStatus={isTogglingCategoriaStatus}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="itens-lista" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Itens Inspecionáveis</h3>
                    
                    <Button 
                      onClick={() => setIsItemDialogOpen(true)}
                      disabled={categorias.filter(c => c.ativo).length === 0}
                    >
                      <Package className="mr-2 h-4 w-4" /> Novo Item
                    </Button>
                  </div>

                  {categorias.filter(c => c.ativo).length === 0 && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            É necessário criar pelo menos uma categoria ativa antes de criar itens inspecionáveis.
                          </p>
                          <Button 
                            onClick={() => setIsCategoriaDialogOpen(true)}
                            className="mt-4"
                          >
                            <Tag className="mr-2 h-4 w-4" /> Criar Primeira Categoria
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {categorias.filter(c => c.ativo).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Itens Inspecionáveis</CardTitle>
                        <CardDescription>
                          Gerencie os itens que podem ser inspecionados no sistema.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ItensAdminTable
                          itens={itens}
                          isLoading={isLoadingItens}
                          onEdit={handleEditItem}
                          onToggleStatus={handleToggleItemStatus}
                          isTogglingStatus={isTogglingItemStatus}
                        />
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar cômodos */}
      <ComodoFormDialog
        open={isComodoDialogOpen}
        onOpenChange={handleCloseComodoDialog}
        onSubmit={editingComodo ? handleUpdateComodo : handleCreateComodo}
        comodo={editingComodo}
        isLoading={isCreating || isUpdating}
      />

      {/* Dialog para criar/editar categorias */}
      <CategoriaFormDialog
        open={isCategoriaDialogOpen}
        onOpenChange={handleCloseCategoriaDialog}
        onSubmit={editingCategoria ? handleUpdateCategoria : handleCreateCategoria}
        categoria={editingCategoria}
        isLoading={isCreatingCategoria || isUpdatingCategoria}
      />

      {/* Dialog para criar/editar itens */}
      <ItemFormDialog
        open={isItemDialogOpen}
        onOpenChange={handleCloseItemDialog}
        onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
        item={editingItem}
        categorias={categorias}
        isLoading={isCreatingItem || isUpdatingItem}
      />
    </div>
  );
};

export default AdminPanel;
