
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Home } from "lucide-react";
import { Tipologia } from "@/types/tipologia";

interface TipologiaCardProps {
  tipologia: Tipologia;
  onEdit: (tipologia: Tipologia) => void;
  onDelete: (tipologiaId: string) => void;
}

export const TipologiaCard = ({ tipologia, onEdit, onDelete }: TipologiaCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          {tipologia.nome}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(tipologia)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(tipologia.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {tipologia.metragem && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-sm">
              {tipologia.metragem}m²
            </Badge>
          </div>
        )}
        {tipologia.descricao && (
          <p className="text-sm text-muted-foreground">
            {tipologia.descricao}
          </p>
        )}
        <div className="mt-3 text-xs text-muted-foreground">
          Criado em {new Date(tipologia.created_at).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};
