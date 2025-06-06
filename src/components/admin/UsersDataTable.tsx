
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";
import { Profile } from "@/hooks/useSupabaseUsers";
import { UserSearch } from "./UserSearch";
import { UserTableActions } from "./UserTableActions";

interface UsersDataTableProps {
  users: Profile[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEditUser: (user: Profile) => void;
  onToggleStatus: (user: Profile) => void;
  onDeleteUser: (user: Profile) => void;
  onAddUser: () => void;
  onManualRefresh: () => void;
}

export const UsersDataTable = ({
  users,
  searchTerm,
  onSearchChange,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onAddUser,
  onManualRefresh
}: UsersDataTableProps) => {
  const getInitials = (profile: Profile) => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Usuários do Sistema ({users.length})</CardTitle>
            <CardDescription>
              Lista de todos os usuários registrados no sistema.
            </CardDescription>
          </div>
          <UserSearch searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <p className="text-gray-500">Nenhum usuário encontrado para "{searchTerm}"</p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
                <div className="space-y-2">
                  <Button onClick={onAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" /> Criar Primeiro Usuário
                  </Button>
                  <Button variant="outline" onClick={onManualRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Atualizar Lista
                  </Button>
                </div>
              </div>
            )}
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
                    <UserTableActions
                      user={userProfile}
                      onEditUser={onEditUser}
                      onToggleStatus={onToggleStatus}
                      onDeleteUser={onDeleteUser}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
