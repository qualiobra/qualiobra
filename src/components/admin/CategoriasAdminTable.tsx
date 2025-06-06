
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
import { CategoriaItem } from "@/types/itemTypes";

interface CategoriasAdminTableProps {
  categorias: CategoriaItem[];
  isLoading: boolean;
  onEdit: (categoria: CategoriaItem) => void;
  onToggleStatus: (id: string, ativo: boolean) => void;
  isTogglingStatus: boolean;
}

export const CategoriasAdminTable = ({
  categorias,
  isLoading,
  onEdit,
  onToggleStatus,
  isTogglingStatus,
}: CategoriasAdminTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">Carregando categorias...</div>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">Nenhuma categoria encontrada.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crie sua primeira categoria para começar.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-[80px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categorias.map((categoria) => (
          <TableRow key={categoria.id}>
            <TableCell className="font-medium">{categoria.nome}</TableCell>
            <TableCell>
              {categoria.descricao || (
                <span className="text-muted-foreground italic">
                  Sem descrição
                </span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={categoria.ativo ? "default" : "secondary"}>
                {categoria.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(categoria.created_at).toLocaleDateString("pt-BR")}
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
                  <DropdownMenuItem onClick={() => onEdit(categoria)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onToggleStatus(categoria.id, !categoria.ativo)
                    }
                    disabled={isTogglingStatus}
                  >
                    {categoria.ativo ? (
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
