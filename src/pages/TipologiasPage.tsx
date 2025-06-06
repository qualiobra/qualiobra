
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TipologiasList } from "@/components/tipologias/TipologiasList";
import { useObras } from "@/hooks/useObras";

export default function TipologiasPage() {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();
  const { obras } = useObras();

  const obra = obras.find(o => o.id === obraId);

  if (!obraId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Obra não encontrada</h1>
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
          onClick={() => navigate("/obras")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Obras
        </Button>
      </div>

      <TipologiasList 
        obraId={obraId} 
        obraNome={obra?.nome || "Obra não encontrada"} 
      />
    </div>
  );
}
