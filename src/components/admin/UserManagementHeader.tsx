
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, UserPlus } from "lucide-react";

interface UserManagementHeaderProps {
  isCreatingUser: boolean;
  onManualRefresh: () => void;
  onInviteUser: () => void;
  onAddUser: () => void;
}

export const UserManagementHeader = ({
  isCreatingUser,
  onManualRefresh,
  onInviteUser,
  onAddUser
}: UserManagementHeaderProps) => {
  return (
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
          onClick={onManualRefresh}
          title="Atualizar lista"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={onInviteUser}
        >
          <Mail className="mr-2 h-4 w-4" /> 
          Convidar
        </Button>
        <Button onClick={onAddUser} disabled={isCreatingUser}>
          <UserPlus className="mr-2 h-4 w-4" /> 
          {isCreatingUser ? "Criando..." : "Novo Usuário"}
        </Button>
      </div>
    </div>
  );
};
