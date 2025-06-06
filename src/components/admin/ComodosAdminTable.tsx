
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { MoreVertical, Pencil, Power, PowerOff, Search } from "lucide-react";
import { ComodoMaster } from "@/hooks/admin/useComodosAdmin";
import * as LucideIcons from "lucide-react";

interface ComodosAdminTableProps {
  comodos: ComodoMaster[];
  isLoading: boolean;
  onEdit: (comodo: ComodoMaster) => void;
  onToggleStatus: (id: string, ativo: boolean) => void;
  isTogglingStatus: boolean;
}

export const ComodosAdminTable = ({
  comodos,
  isLoading,
  onEdit,
  onToggleStatus,
  isTogglingStatus,
}: ComodosAdminTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar cômodos por termo de busca
  const filteredComodos = comodos.filter((comodo) =>
    comodo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comodo.descricao && comodo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Renderizar ícone dinamicamente
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return <LucideIcons.Home className="h-5 w-5" />;
  };

  // Estatísticas
  const totalComodos = comodos.length;
  const comodosAtivos = comodos.filter(c => c.ativo).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cômodos..." disabled />
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Carregando cômodos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de busca e estatísticas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cômodos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {totalComodos}</span>
          <span>Ativos: {comodosAtivos}</span>
          <span>Inativos: {totalComodos - comodosAtivos}</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ícone</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComodos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "Nenhum cômodo encontrado com esse termo." : "Nenhum cômodo cadastrado."}
                </TableCell>
              </TableRow>
            ) : (
              filteredComodos.map((comodo) => (
                <TableRow key={comodo.id}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {renderIcon(comodo.icone)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{comodo.nome}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {comodo.descricao || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={comodo.ativo ? "default" : "secondary"}>
                      {comodo.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          disabled={isTogglingStatus}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(comodo)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(comodo.id, !comodo.ativo)}
                          className={comodo.ativo ? "text-orange-600" : "text-green-600"}
                        >
                          {comodo.ativo ? (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
