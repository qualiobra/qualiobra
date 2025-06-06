
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Door } from "lucide-react";
import { ComodoTipologia } from "@/types/comodo";

interface ComodoCardProps {
  comodo: ComodoTipologia;
  onEdit: (comodo: ComodoTipologia) => void;
  onDelete: (comodoId: string) => void;
}

export const ComodoCard = ({ comodo, onEdit, onDelete }: ComodoCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Door className="h-5 w-5 text-primary" />
          {comodo.nome}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(comodo)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(comodo.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {comodo.descricao && (
          <p className="text-sm text-muted-foreground mb-3">
            {comodo.descricao}
          </p>
        )}
        <div className="text-xs text-muted-foreground">
          Criado em {new Date(comodo.created_at).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};
