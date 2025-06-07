
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseRoles, useUserRoleAssignments } from "@/hooks/useSupabaseRoles";
import { useRoleAssignmentMutations } from "@/hooks/useRoleAssignmentMutations";
import { Profile } from "@/hooks/useSupabaseUsers";
import { UserPlus } from "lucide-react";

interface UserRoleManagerProps {
  user: Profile;
}

export const UserRoleManager = ({ user }: UserRoleManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  
  const { roles } = useSupabaseRoles();
  const { data: userRoles = [] } = useUserRoleAssignments(user.id);
  const { assignRole, removeRole, isAssigning } = useRoleAssignmentMutations();

  const availableRoles = roles.filter(
    role => !userRoles.some(ur => ur.role_id === role.id)
  );

  const handleAssignRole = () => {
    if (selectedRoleId) {
      assignRole.mutate(
        { userId: user.id, roleId: selectedRoleId },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setSelectedRoleId("");
          },
        }
      );
    }
  };

  const handleRemoveRole = (roleId: string) => {
    removeRole.mutate({ userId: user.id, roleId });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Roles</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          disabled={availableRoles.length === 0}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
        {userRoles.map((assignment) => (
          <Badge
            key={assignment.id}
            variant="secondary"
            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleRemoveRole(assignment.role_id)}
            title="Clique para remover"
          >
            {assignment.user_roles.display_name}
          </Badge>
        ))}
        {userRoles.length === 0 && (
          <span className="text-sm text-muted-foreground">Nenhum role atribuído</span>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Role</DialogTitle>
            <DialogDescription>
              Selecione um role para atribuir ao usuário {user.first_name} {user.last_name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedRoleId || isAssigning}
            >
              {isAssigning ? "Atribuindo..." : "Atribuir Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
