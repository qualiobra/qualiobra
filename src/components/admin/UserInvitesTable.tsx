
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUserInvites, type UserInvite } from "@/hooks/useUserInvites";

interface UserInvitesTableProps {
  onDeleteInvite: (inviteId: string) => void;
}

export const UserInvitesTable = ({ onDeleteInvite }: UserInvitesTableProps) => {
  const { invites, isLoading } = useUserInvites();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convites Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse">Carregando convites...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (invite: UserInvite) => {
    if (invite.used_at) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Aceito
        </Badge>
      );
    }
    
    const isExpired = new Date(invite.expires_at) < new Date();
    if (isExpired) {
      return (
        <Badge variant="destructive">
          <Clock className="mr-1 h-3 w-3" />
          Expirado
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Pendente
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convites ({invites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum convite encontrado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium">{invite.email}</TableCell>
                  <TableCell>{invite.role === 'admin' ? 'Administrador' : 'Usuário'}</TableCell>
                  <TableCell>{getStatusBadge(invite)}</TableCell>
                  <TableCell>
                    {format(new Date(invite.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invite.expires_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteInvite(invite.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
