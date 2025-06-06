
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TipologiaForm } from "./TipologiaForm";
import { Tipologia } from "@/types/tipologia";

interface TipologiaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipologia?: Tipologia | null;
  obraId: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const TipologiaDialog = ({
  open,
  onOpenChange,
  tipologia,
  obraId,
  onSubmit,
  isLoading = false,
}: TipologiaDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tipologia ? "Editar Tipologia" : "Nova Tipologia"}
          </DialogTitle>
        </DialogHeader>
        <TipologiaForm
          tipologia={tipologia}
          obraId={obraId}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
