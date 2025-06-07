
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPermissions } from "@/hooks/useSupabaseRoles";
import { Profile } from "@/hooks/useSupabaseUsers";

interface UserPermissionsViewProps {
  user: Profile;
}

export const UserPermissionsView = ({ user }: UserPermissionsViewProps) => {
  const { data: permissions = [] } = useUserPermissions(user.id);

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission.action);
    return acc;
  }, {} as Record<string, string[]>);

  const moduleLabels = {
    usuarios: 'Usuários',
    obras: 'Obras',
    fornecedores: 'Fornecedores',
    inspections: 'Inspeções',
    reports: 'Relatórios',
    diagnostico: 'Diagnóstico',
    admin: 'Administração',
  };

  const actionLabels = {
    create: 'Criar',
    read: 'Visualizar',
    update: 'Editar',
    delete: 'Excluir',
    approve: 'Aprovar',
    audit: 'Auditar',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Permissões do Usuário</CardTitle>
        <CardDescription>
          Permissões efetivas baseadas nos roles atribuídos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedPermissions).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Usuário não possui permissões atribuídas
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([module, actions]) => (
              <div key={module}>
                <h4 className="font-medium mb-2">
                  {moduleLabels[module as keyof typeof moduleLabels] || module}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {actions.map((action) => (
                    <Badge key={`${module}-${action}`} variant="outline">
                      {actionLabels[action as keyof typeof actionLabels] || action}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
