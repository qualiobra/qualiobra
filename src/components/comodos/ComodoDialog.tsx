
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComodoForm } from "./ComodoForm";
import { ComodoTipologia } from "@/types/comodo";

interface ComodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comodo?: ComodoTipologia | null;
  tipologiaId: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ComodoDialog = ({
  open,
  onOpenChange,
  comodo,
  tipologiaId,
  onSubmit,
  isLoading = false,
}: ComodoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {comodo ? "Editar Cômodo" : "Novo Cômodo"}
          </DialogTitle>
        </DialogHeader>
        <ComodoForm
          comodo={comodo}
          tipologiaId={tipologiaId}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
