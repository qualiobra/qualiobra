
import React, { useEffect, useState } from "react";
import { useObras } from "@/hooks/useObras";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ObraForm } from "./ObraForm";
import { ObraFormValues } from "./schemas/obraFormSchema";

interface EditarObraDialogProps {
  obraId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditarObraDialog({ obraId, open, onOpenChange }: EditarObraDialogProps) {
  const { obras, atualizarObra } = useObras();
  const obra = obras.find(o => o.id === obraId);
  const [defaultValues, setDefaultValues] = useState<ObraFormValues>({
    nome: "",
    descricao: "",
    localizacao: "",
    dataInicio: new Date(),
    status: "em_andamento",
  });
  
  // Preencher formulário quando a obra for encontrada
  useEffect(() => {
    if (obra) {
      setDefaultValues({
        nome: obra.nome,
        descricao: obra.descricao,
        localizacao: obra.localizacao,
        dataInicio: new Date(obra.dataInicio),
        status: obra.status,
      });
    }
  }, [obra]);

  function onSubmit(data: ObraFormValues) {
    if (!obra) return;
    
    atualizarObra(obraId, {
      ...data,
      dataInicio: data.dataInicio.toISOString(),
    });
    
    toast({
      title: "Obra atualizada",
      description: `Os dados da obra "${data.nome}" foram atualizados com sucesso.`,
    });
    
    onOpenChange(false);
  }
  
  if (!obra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Obra</DialogTitle>
        </DialogHeader>
        
        <ObraForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
