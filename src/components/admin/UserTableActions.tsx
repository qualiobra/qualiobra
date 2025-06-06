
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { Profile } from "@/hooks/useSupabaseUsers";

interface UserTableActionsProps {
  user: Profile;
  onEditUser: (user: Profile) => void;
  onToggleStatus: (user: Profile) => void;
  onDeleteUser: (user: Profile) => void;
}

export const UserTableActions = ({
  user,
  onEditUser,
  onToggleStatus,
  onDeleteUser
}: UserTableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEditUser(user)}>
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(user)}>
          <ShieldCheck className="mr-2 h-4 w-4" /> 
          {user.status === "active" ? "Desativar" : "Ativar"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600" 
          onClick={() => onDeleteUser(user)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
