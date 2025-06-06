
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tipologia } from "@/types/tipologia";

interface TipologiaFormProps {
  tipologia?: Tipologia | null;
  obraId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TipologiaForm = ({ 
  tipologia, 
  obraId, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: TipologiaFormProps) => {
  const [nome, setNome] = useState("");
  const [metragem, setMetragem] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (tipologia) {
      setNome(tipologia.nome);
      setMetragem(tipologia.metragem?.toString() || "");
      setDescricao(tipologia.descricao || "");
    } else {
      setNome("");
      setMetragem("");
      setDescricao("");
    }
  }, [tipologia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nome: nome.trim(),
      metragem: metragem ? parseFloat(metragem) : undefined,
      descricao: descricao.trim() || undefined,
    };

    if (tipologia) {
      onSubmit({ id: tipologia.id, ...data });
    } else {
      onSubmit({ obra_id: obraId, ...data });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome da Tipologia *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Apartamento 2 quartos"
          required
        />
      </div>

      <div>
        <Label htmlFor="metragem">Metragem (m²)</Label>
        <Input
          id="metragem"
          type="number"
          step="0.01"
          min="0"
          value={metragem}
          onChange={(e) => setMetragem(e.target.value)}
          placeholder="Ex: 75.50"
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição adicional da tipologia..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !nome.trim()}
        >
          {isLoading ? "Salvando..." : tipologia ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};
