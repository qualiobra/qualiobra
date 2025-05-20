
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DiagnosticoEscalaPontuacaoProps {
  idQuestao: string;
  tipoPontuacao: string;
  valorAtual: string;
  onChange: (valor: number) => void;
}

const DiagnosticoEscalaPontuacao = ({
  idQuestao,
  tipoPontuacao,
  valorAtual,
  onChange
}: DiagnosticoEscalaPontuacaoProps) => {
  
  if (tipoPontuacao === "Sim/Não (1 ou 5)") {
    return (
      <RadioGroup 
        value={valorAtual || ""} 
        onValueChange={(value) => onChange(parseInt(value))}
      >
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id={`${idQuestao}-nao`} />
            <Label htmlFor={`${idQuestao}-nao`}>Não (1)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id={`${idQuestao}-sim`} />
            <Label htmlFor={`${idQuestao}-sim`}>Sim (5)</Label>
          </div>
        </div>
      </RadioGroup>
    );
  } 
  
  return (
    <RadioGroup 
      value={valorAtual || ""} 
      onValueChange={(value) => onChange(parseInt(value))}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id={`${idQuestao}-1`} />
          <Label htmlFor={`${idQuestao}-1`}>1 - Não implementado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id={`${idQuestao}-2`} />
          <Label htmlFor={`${idQuestao}-2`}>2 - Parcialmente</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3" id={`${idQuestao}-3`} />
          <Label htmlFor={`${idQuestao}-3`}>3 - Implementado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="4" id={`${idQuestao}-4`} />
          <Label htmlFor={`${idQuestao}-4`}>4 - Documentado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="5" id={`${idQuestao}-5`} />
          <Label htmlFor={`${idQuestao}-5`}>5 - Melhorado</Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default DiagnosticoEscalaPontuacao;
