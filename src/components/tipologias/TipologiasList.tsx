
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react";
import { TipologiaCard } from "./TipologiaCard";
import { TipologiaDialog } from "./TipologiaDialog";
import { useTipologias } from "@/hooks/useTipologias";
import { Tipologia } from "@/types/tipologia";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TipologiasListProps {
  obraId: string;
  obraNome: string;
}

export const TipologiasList = ({ obraId, obraNome }: TipologiasListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTipologia, setEditingTipologia] = useState<Tipologia | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tipologiaToDelete, setTipologiaToDelete] = useState<string | null>(null);

  const {
    tipologias,
    isLoading,
    createTipologia,
    updateTipologia,
    deleteTipologia,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTipologias(obraId);

  const handleCreate = () => {
    setEditingTipologia(null);
    setDialogOpen(true);
  };

  const handleEdit = (tipologia: Tipologia) => {
    setEditingTipologia(tipologia);
    setDialogOpen(true);
  };

  const handleDelete = (tipologiaId: string) => {
    setTipologiaToDelete(tipologiaId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (tipologiaToDelete) {
      deleteTipologia(tipologiaToDelete);
      setTipologiaToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingTipologia) {
      updateTipologia(data);
    } else {
      createTipologia(data);
    }
    setDialogOpen(false);
    setEditingTipologia(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando tipologias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Tipologias da Obra
          </h2>
          <p className="text-muted-foreground">{obraNome}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tipologia
        </Button>
      </div>

      {tipologias.length === 0 ? (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">Nenhuma tipologia cadastrada</h3>
          <p className="mt-1 text-muted-foreground">
            Comece criando a primeira tipologia para esta obra.
          </p>
          <Button className="mt-4" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeira tipologia
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tipologias.map((tipologia) => (
            <TipologiaCard
              key={tipologia.id}
              tipologia={tipologia}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TipologiaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tipologia={editingTipologia}
        obraId={obraId}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tipologia? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
