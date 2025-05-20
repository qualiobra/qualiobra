
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
      
      // Ensure all anexosObra items have required fields
      const anexosObra = values.anexosObra?.map(anexo => ({
        nome: anexo.nome,
        url: anexo.url,
        tipo: anexo.tipo
      })) || [];
      
      atualizarObra(obraId, {
        codigoDaObra: values.codigoDaObra,
        nome: values.nome,
        descricao: values.descricao,
        localizacao: values.localizacao,
        cepCodigoPostal: values.cepCodigoPostal,
        dataInicio: values.dataInicio,
        dataPrevistaTermino: values.dataPrevistaTermino,
        status: values.status,
        nivelPBQPH: values.nivelPBQPH,
        documentos: values.documentos,
        anexosObra: anexosObra,
        responsavelEngenheiroNome: values.responsavelEngenheiroNome,
        responsavelEngenheiroEmail: values.responsavelEngenheiroEmail,
        responsavelEngenheiroTelefone: values.responsavelEngenheiroTelefone,
        observacoesGerais: values.observacoesGerais,
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Obra: {obra.nome}</DialogTitle>
        </DialogHeader>
        
        <ObraForm 
          defaultValues={{
            codigoDaObra: obra.codigoDaObra,
            nome: obra.nome,
            descricao: obra.descricao,
            localizacao: obra.localizacao,
            cepCodigoPostal: obra.cepCodigoPostal,
            dataInicio: new Date(obra.dataInicio),
            dataPrevistaTermino: obra.dataPrevistaTermino ? new Date(obra.dataPrevistaTermino) : undefined,
            status: obra.status,
            nivelPBQPH: obra.nivelPBQPH || "Não Aplicável",
            documentos: obra.documentos,
            anexosObra: obra.anexosObra || [],
            responsavelEngenheiroNome: obra.responsavelEngenheiroNome || "",
            responsavelEngenheiroEmail: obra.responsavelEngenheiroEmail,
            responsavelEngenheiroTelefone: obra.responsavelEngenheiroTelefone,
            observacoesGerais: obra.observacoesGerais,
          }}
          onSubmit={handleSubmit}
          submitButtonText="Salvar Alterações"
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}
