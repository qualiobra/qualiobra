
import { useState } from "react";
import { useObras } from "@/hooks/useObras";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import ObraForm from "./ObraForm";
import { type ObraFormValues } from "./ObraFormSchema";

interface NovaObraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NovaObraDialog({ open, onOpenChange }: NovaObraDialogProps) {
  const { adicionarObra } = useObras();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ObraFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Make sure all required properties are passed
      adicionarObra({
        nome: values.nome,
        descricao: values.descricao,
        localizacao: values.localizacao,
        dataInicio: values.dataInicio,
        status: values.status,
        documentos: values.documentos || [],
        usuarios: [], // Initialize with empty array
      });
      
      toast({
        title: "Obra criada com sucesso",
        description: "A obra foi adicionada ao sistema.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao criar obra",
        description: "Ocorreu um erro ao tentar criar a obra. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nova Obra</DialogTitle>
        </DialogHeader>
        
        <ObraForm 
          onSubmit={handleSubmit}
          submitButtonText="Adicionar Obra"
        />
      </DialogContent>
    </Dialog>
  );
}
