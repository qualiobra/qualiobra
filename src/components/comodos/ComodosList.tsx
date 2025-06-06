
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react";
import { ComodoCard } from "./ComodoCard";
import { ComodoDialog } from "./ComodoDialog";
import { useComodosTipologia } from "@/hooks/useComodosTipologia";
import { ComodoTipologia } from "@/types/comodo";
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

interface ComodosListProps {
  tipologiaId: string;
  tipologiaNome: string;
}

export const ComodosList = ({ tipologiaId, tipologiaNome }: ComodosListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComodo, setEditingComodo] = useState<ComodoTipologia | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [comodoToDelete, setComodoToDelete] = useState<string | null>(null);

  const {
    comodos,
    isLoading,
    createComodo,
    updateComodo,
    deleteComodo,
    isCreating,
    isUpdating,
    isDeleting,
  } = useComodosTipologia(tipologiaId);

  const handleCreate = () => {
    setEditingComodo(null);
    setDialogOpen(true);
  };

  const handleEdit = (comodo: ComodoTipologia) => {
    setEditingComodo(comodo);
    setDialogOpen(true);
  };

  const handleDelete = (comodoId: string) => {
    setComodoToDelete(comodoId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (comodoToDelete) {
      deleteComodo(comodoToDelete);
      setComodoToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingComodo) {
      updateComodo(data);
    } else {
      createComodo(data);
    }
    setDialogOpen(false);
    setEditingComodo(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando cômodos...</p>
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
            Cômodos da Tipologia
          </h2>
          <p className="text-muted-foreground">{tipologiaNome}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cômodo
        </Button>
      </div>

      {comodos.length === 0 ? (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">Nenhum cômodo cadastrado</h3>
          <p className="mt-1 text-muted-foreground">
            Comece criando o primeiro cômodo para esta tipologia.
          </p>
          <Button className="mt-4" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeiro cômodo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comodos.map((comodo) => (
            <ComodoCard
              key={comodo.id}
              comodo={comodo}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ComodoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        comodo={editingComodo}
        tipologiaId={tipologiaId}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cômodo? Esta ação não pode ser desfeita.
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
