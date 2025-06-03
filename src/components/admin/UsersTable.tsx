
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/types/user";
import { UserActionsDropdown } from "./UserActionsDropdown";

interface UsersTableProps {
  users: UserData[];
  onEditUser: (user: UserData) => void;
  onToggleStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onResendInvitation: (userId: string) => void;
}

export const UsersTable = ({
  users,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onResendInvitation,
}: UsersTableProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Foto</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
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
            <TableCell>{user.telefoneWhatsApp || "-"}</TableCell>
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
              <UserActionsDropdown
                user={user}
                onEdit={onEditUser}
                onToggleStatus={onToggleStatus}
                onDelete={onDeleteUser}
                onResendInvitation={onResendInvitation}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
