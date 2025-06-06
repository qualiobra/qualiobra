
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TipologiasButtonProps {
  obraId: string;
  tipologiasCount?: number;
}

export const TipologiasButton = ({ obraId, tipologiasCount = 0 }: TipologiasButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate(`/obras/${obraId}/tipologias`)}
      className="flex items-center gap-2"
    >
      <Home className="h-4 w-4" />
      Tipologias ({tipologiasCount})
    </Button>
  );
};
