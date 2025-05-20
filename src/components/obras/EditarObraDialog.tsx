
import { useState } from "react";
import { useObras } from "@/hooks/useObras";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import ObraForm from "./ObraForm";
import { type ObraFormValues } from "./ObraFormSchema";

interface EditarObraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obraId: string;
}

export default function EditarObraDialog({ open, onOpenChange, obraId }: EditarObraDialogProps) {
  const { obras, atualizarObra } = useObras();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const obra = obras.find(o => o.id === obraId);

  const handleSubmit = async (values: ObraFormValues) => {
    if (!obra) return;
    
    try {
      setIsSubmitting(true);
      
      atualizarObra(obraId, {
        ...values,
      });
      
      toast({
        title: "Obra atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar obra",
        description: "Ocorreu um erro ao tentar atualizar a obra. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!obra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Obra: {obra.nome}</DialogTitle>
        </DialogHeader>
        
        <ObraForm 
          defaultValues={{
            nome: obra.nome,
            descricao: obra.descricao,
            localizacao: obra.localizacao,
            dataInicio: new Date(obra.dataInicio),
            status: obra.status,
            documentos: obra.documentos,
          }}
          onSubmit={handleSubmit}
          submitButtonText="Salvar Alterações"
        />
      </DialogContent>
    </Dialog>
  );
}
