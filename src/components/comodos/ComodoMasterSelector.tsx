
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComodosManager } from "@/hooks/useComodosManager";
import { ComodoMaster } from "@/types/comodoTypes";
import * as LucideIcons from "lucide-react";
import { Plus } from "lucide-react";

interface ComodoMasterSelectorProps {
  selectedMasterId?: string | null;
  onMasterSelect: (master: ComodoMaster | null) => void;
  onCreateCustom: () => void;
  isCustomMode: boolean;
}

export const ComodoMasterSelector = ({
  selectedMasterId,
  onMasterSelect,
  onCreateCustom,
  isCustomMode,
}: ComodoMasterSelectorProps) => {
  const { comodosmaster, isLoading } = useComodosManager();

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />;
    }
    return <LucideIcons.Home className="h-4 w-4" />;
  };

  if (isCustomMode) {
    return (
      <div className="space-y-2">
        <Label>Tipo de Cômodo</Label>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMasterSelect(null)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Criando cômodo personalizado
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Tipo de Cômodo</Label>
      <div className="flex gap-2">
        <Select
          value={selectedMasterId || ""}
          onValueChange={(value) => {
            if (value === "") {
              onMasterSelect(null);
            } else {
              const master = comodosmaster.find(m => m.id === value);
              if (master) {
                onMasterSelect(master);
              }
            }
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um cômodo padrão"}>
              {selectedMasterId && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const master = comodosmaster.find(m => m.id === selectedMasterId);
                    return master ? (
                      <>
                        {renderIcon(master.icone)}
                        <span>{master.nome}</span>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum (personalizado)</SelectItem>
            {comodosmaster
              .filter(master => master.ativo)
              .map((master) => (
                <SelectItem key={master.id} value={master.id}>
                  <div className="flex items-center gap-2">
                    {renderIcon(master.icone)}
                    <span>{master.nome}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={onCreateCustom}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {selectedMasterId && (
        <div className="text-sm text-muted-foreground">
          {(() => {
            const master = comodosmaster.find(m => m.id === selectedMasterId);
            return master?.descricao ? (
              <p className="mt-1">{master.descricao}</p>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};
