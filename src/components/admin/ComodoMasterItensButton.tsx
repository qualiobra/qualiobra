
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ComodoMasterItensDialog } from "./ComodoMasterItensDialog";
import { ComodoMaster } from "@/types/comodoTypes";

interface ComodoMasterItensButtonProps {
  comodo: ComodoMaster;
}

export const ComodoMasterItensButton = ({ comodo }: ComodoMasterItensButtonProps) => {
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

      <ComodoMasterItensDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        comodo={comodo}
      />
    </>
  );
};
