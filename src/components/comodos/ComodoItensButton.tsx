
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ComodoItensDialog } from "./ComodoItensDialog";
import { ComodoTipologia } from "@/types/comodo";

interface ComodoItensButtonProps {
  comodo: ComodoTipologia;
}

export const ComodoItensButton = ({ comodo }: ComodoItensButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Gerenciar Itens
      </Button>

      <ComodoItensDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        comodo={comodo}
      />
    </>
  );
};
