
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Home } from "lucide-react";
import { ComodoTipologia } from "@/types/comodo";
import { ComodoItensButton } from "./ComodoItensButton";

interface ComodoCardProps {
  comodo: ComodoTipologia;
  onEdit: (comodo: ComodoTipologia) => void;
  onDelete: (comodoId: string) => void;
}

export const ComodoCard = ({ comodo, onEdit, onDelete }: ComodoCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          {comodo.nome}
        </CardTitle>
        {comodo.comodo_master_id && (
          <Badge variant="secondary" className="w-fit">
            Baseado em cômodo padrão
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {comodo.descricao && (
          <p className="text-sm text-muted-foreground">{comodo.descricao}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <ComodoItensButton comodo={comodo} />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(comodo)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(comodo.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
