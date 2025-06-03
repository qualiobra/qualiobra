
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ShieldCheck,
  Mail
} from "lucide-react";
import { UserData } from "@/types/user";

interface UserActionsDropdownProps {
  user: UserData;
  onEdit: (user: UserData) => void;
  onToggleStatus: (userId: string) => void;
  onDelete: (userId: string) => void;
  onResendInvitation: (userId: string) => void;
}

export const UserActionsDropdown = ({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
  onResendInvitation,
}: UserActionsDropdownProps) => {
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
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
          <ShieldCheck className="mr-2 h-4 w-4" /> 
          {user.status === "active" ? "Desativar" : "Ativar"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResendInvitation(user.id)}>
          <Mail className="mr-2 h-4 w-4" /> Reenviar Convite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600" 
          onClick={() => onDelete(user.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
