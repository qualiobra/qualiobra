
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
        codigoDaObra: values.codigoDaObra,
        nome: values.nome,
        descricao: values.descricao,
        localizacao: values.localizacao,
        cepCodigoPostal: values.cepCodigoPostal,
        dataInicio: values.dataInicio,
        dataPrevistaTermino: values.dataPrevistaTermino,
        status: values.status,
        nivelPBQPH: values.nivelPBQPH,
        documentos: values.documentos || [],
        anexosObra: values.anexosObra || [],
        responsavelEngenheiroNome: values.responsavelEngenheiroNome,
        responsavelEngenheiroEmail: values.responsavelEngenheiroEmail,
        responsavelEngenheiroTelefone: values.responsavelEngenheiroTelefone,
        observacoesGerais: values.observacoesGerais,
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
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
