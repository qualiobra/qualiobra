
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComodoTipologia } from "@/types/comodo";

interface ComodoFormProps {
  comodo?: ComodoTipologia | null;
  tipologiaId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ComodoForm = ({ 
  comodo, 
  tipologiaId, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ComodoFormProps) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (comodo) {
      setNome(comodo.nome);
      setDescricao(comodo.descricao || "");
    } else {
      setNome("");
      setDescricao("");
    }
  }, [comodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
    };

    if (comodo) {
      onSubmit({ id: comodo.id, ...data });
    } else {
      onSubmit({ tipologia_id: tipologiaId, ...data });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Cômodo *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Sala de estar, Quarto 1, Banheiro social"
          required
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição adicional do cômodo..."
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
          {isLoading ? "Salvando..." : comodo ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};
