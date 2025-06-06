
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComodoTipologia } from "@/types/comodo";
import { ComodoMaster } from "@/types/comodoTypes";
import { ComodoMasterSelector } from "./ComodoMasterSelector";

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
  const [selectedMaster, setSelectedMaster] = useState<ComodoMaster | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (comodo) {
      setNome(comodo.nome);
      setDescricao(comodo.descricao || "");
      setIsCustomMode(!comodo.comodo_master_id);
      setSelectedMaster(null); // Para edição, não precisamos do master original
    } else {
      setNome("");
      setDescricao("");
      setIsCustomMode(false);
      setSelectedMaster(null);
    }
  }, [comodo]);

  const handleMasterSelect = (master: ComodoMaster | null) => {
    setSelectedMaster(master);
    if (master) {
      setNome(master.nome);
      setDescricao(master.descricao || "");
      setIsCustomMode(false);
    } else {
      setIsCustomMode(true);
      setNome("");
      setDescricao("");
    }
  };

  const handleCreateCustom = () => {
    setIsCustomMode(true);
    setSelectedMaster(null);
    setNome("");
    setDescricao("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      comodo_master_id: selectedMaster?.id || null,
    };

    if (comodo) {
      onSubmit({ id: comodo.id, ...data });
    } else {
      onSubmit({ tipologia_id: tipologiaId, ...data });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!comodo && (
        <ComodoMasterSelector
          selectedMasterId={selectedMaster?.id}
          onMasterSelect={handleMasterSelect}
          onCreateCustom={handleCreateCustom}
          isCustomMode={isCustomMode}
        />
      )}

      <div>
        <Label htmlFor="nome">Nome do Cômodo *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Sala de estar, Quarto 1, Banheiro social"
          required
          disabled={selectedMaster && !isCustomMode}
        />
        {selectedMaster && !isCustomMode && (
          <p className="text-xs text-muted-foreground mt-1">
            Nome baseado no cômodo padrão selecionado
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição adicional do cômodo..."
          rows={3}
          disabled={selectedMaster && !isCustomMode}
        />
        {selectedMaster && !isCustomMode && (
          <p className="text-xs text-muted-foreground mt-1">
            Descrição baseada no cômodo padrão selecionado
          </p>
        )}
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
