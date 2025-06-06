
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComodosButtonProps {
  obraId: string;
  tipologiaId: string;
  comodosCount?: number;
}

export const ComodosButton = ({ obraId, tipologiaId, comodosCount = 0 }: ComodosButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/obras/${obraId}/tipologias/${tipologiaId}/comodos`)}
      className="flex items-center gap-2"
    >
      <Home className="h-4 w-4" />
      Cômodos ({comodosCount})
    </Button>
  );
};
