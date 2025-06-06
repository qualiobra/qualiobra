
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ComodosList } from "@/components/comodos/ComodosList";
import { useTipologias } from "@/hooks/useTipologias";

export default function ComodosPage() {
  const { obraId, tipologiaId } = useParams<{ obraId: string; tipologiaId: string }>();
  const navigate = useNavigate();
  const { tipologias } = useTipologias(obraId);

  const tipologia = tipologias.find(t => t.id === tipologiaId);

  if (!obraId || !tipologiaId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Tipologia não encontrada</h1>
          <Button className="mt-4" onClick={() => navigate("/obras")}>
            Voltar para Obras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/obras/${obraId}/tipologias`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Tipologias
        </Button>
      </div>

      <ComodosList 
        tipologiaId={tipologiaId} 
        tipologiaNome={tipologia?.nome || "Tipologia não encontrada"} 
      />
    </div>
  );
}
