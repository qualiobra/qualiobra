
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useComodosItens } from "@/hooks/admin/useComodosItens";
import { useItensAdmin } from "@/hooks/admin/useItensAdmin";
import { ComodoTipologia } from "@/types/comodo";
import { Settings, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ComodoItensDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comodo: ComodoTipologia;
}

export const ComodoItensDialog = ({
  open,
  onOpenChange,
  comodo,
}: ComodoItensDialogProps) => {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [ordem, setOrdem] = useState<number>(1);

  const {
    comodoItens,
    isLoading: isLoadingItens,
    createComodoItem,
    deleteComodoItem,
    toggleObrigatorio,
    isCreating,
    isDeleting,
    isTogglingObrigatorio,
  } = useComodosItens(comodo.id);

  const { itens, isLoading: isLoadingAllItens } = useItensAdmin();

  // Atualizar ordem baseada nos itens existentes
  useEffect(() => {
    if (comodoItens.length > 0) {
      const maxOrdem = Math.max(...comodoItens.map(item => item.ordem));
      setOrdem(maxOrdem + 1);
    } else {
      setOrdem(1);
    }
  }, [comodoItens]);

  // Filtrar itens que ainda não estão associados ao cômodo
  const itensDisponiveis = itens.filter(
    item => !comodoItens.some(comodoItem => comodoItem.item_id === item.id) && item.ativo
  );

  const handleAddItem = () => {
    if (!selectedItemId) {
      toast({
        title: "Erro",
        description: "Selecione um item para adicionar.",
        variant: "destructive",
      });
      return;
    }

    createComodoItem({
      comodo_id: comodo.id,
      item_id: selectedItemId,
      obrigatorio: false,
      ordem: ordem,
    });

    setSelectedItemId("");
  };

  const handleToggleObrigatorio = (itemId: string, currentValue: boolean) => {
    toggleObrigatorio({ id: itemId, obrigatorio: !currentValue });
  };

  const handleRemoveItem = (itemId: string) => {
    deleteComodoItem(itemId);
  };

  if (isLoadingItens || isLoadingAllItens) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciar Itens - {comodo.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciar Itens - {comodo.nome}
          </DialogTitle>
          <DialogDescription>
            Adicione e configure os itens que devem ser inspecionados neste cômodo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar novo item */}
          <div className="border rounded-lg p-4 space-y-4">
            <Label className="text-base font-semibold">Adicionar Item</Label>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="item-select">Item</Label>
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {itensDisponiveis.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Todos os itens já foram adicionados
                      </SelectItem>
                    ) : (
                      itensDisponiveis.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center gap-2">
                            <span>{item.nome}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.categoria_nome}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  min="1"
                  value={ordem}
                  onChange={(e) => setOrdem(parseInt(e.target.value) || 1)}
                />
              </div>
              <Button
                onClick={handleAddItem}
                disabled={isCreating || !selectedItemId || itensDisponiveis.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </div>

          {/* Lista de itens associados */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Itens do Cômodo ({comodoItens.length})
            </Label>
            
            {comodoItens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                <Settings className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Nenhum item associado a este cômodo.</p>
                <p className="text-sm">Adicione itens usando o formulário acima.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {comodoItens
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <GripVertical className="h-4 w-4" />
                          <span className="text-sm font-mono">{item.ordem}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.item_nome}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.categoria_nome}
                            </Badge>
                            {item.obrigatorio && (
                              <Badge variant="destructive" className="text-xs">
                                Obrigatório
                              </Badge>
                            )}
                          </div>
                          {item.item_descricao && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.item_descricao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.obrigatorio}
                            onCheckedChange={() => handleToggleObrigatorio(item.id, item.obrigatorio)}
                            disabled={isTogglingObrigatorio}
                          />
                          <Label className="text-sm">Obrigatório</Label>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
