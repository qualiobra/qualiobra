
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Power, PowerOff } from "lucide-react";
import { ItemInspecionavel } from "@/types/itemTypes";

interface ItensAdminTableProps {
  itens: (ItemInspecionavel & { categoria_nome: string })[];
  isLoading: boolean;
  onEdit: (item: ItemInspecionavel) => void;
  onToggleStatus: (id: string, ativo: boolean) => void;
  isTogglingStatus: boolean;
}

export const ItensAdminTable = ({
  itens,
  isLoading,
  onEdit,
  onToggleStatus,
  isTogglingStatus,
}: ItensAdminTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">Carregando itens...</div>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">Nenhum item encontrado.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crie seu primeiro item inspecionável para começar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-[80px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itens.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.nome}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {item.categoria_nome || "Sem categoria"}
              </Badge>
            </TableCell>
            <TableCell>
              {item.descricao || (
                <span className="text-muted-foreground italic">
                  Sem descrição
                </span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={item.ativo ? "default" : "secondary"}>
                {item.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(item.created_at).toLocaleDateString("pt-BR")}
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
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(item.id, !item.ativo)}
                    disabled={isTogglingStatus}
                  >
                    {item.ativo ? (
                      <>
                        <PowerOff className="mr-2 h-4 w-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Power className="mr-2 h-4 w-4" />
                        Ativar
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
