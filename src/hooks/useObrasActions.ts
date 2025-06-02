
import type { Obra, ObraUsuario } from "@/types/obra";

export const useObrasActions = (obras: Obra[], setObras: React.Dispatch<React.SetStateAction<Obra[]>>) => {
  const criarObra = (novaObra: Omit<Obra, "id">) => {
    const id = Date.now().toString();
    const obraComId: Obra = { ...novaObra, id };
    setObras((prevObras) => [...prevObras, obraComId]);
  };

  const atualizarObra = (id: string, obraAtualizada: Partial<Obra>) => {
    setObras((prevObras) =>
      prevObras.map((obra) => (obra.id === id ? { ...obra, ...obraAtualizada } : obra))
    );
  };

  const arquivarObra = (id: string) => {
    setObras((prevObras) =>
      prevObras.map((obra) => (obra.id === id ? { ...obra, status: "arquivada" } : obra))
    );
  };
  
  const atribuirUsuario = (obraId: string, usuario: ObraUsuario) => {
    setObras(prevObras => {
      return prevObras.map(obra => {
        if (obra.id === obraId) {
          return {
            ...obra,
            usuarios: [...obra.usuarios, usuario]
          };
        }
        return obra;
      });
    });
  };
  
  const removerUsuario = (obraId: string, userId: string) => {
    setObras(prevObras => {
      return prevObras.map(obra => {
        if (obra.id === obraId) {
          return {
            ...obra,
            usuarios: obra.usuarios.filter(usuario => usuario.userId !== userId)
          };
        }
        return obra;
      });
    });
  };

  const gerarCodigoObra = () => {
    const anoAtual = new Date().getFullYear();
    const numeroExistente = obras.length > 0 
      ? Math.max(...obras.map(o => {
        const match = o.codigoDaObra?.match(/OBRA-\d{4}-(\d{3})/);
        return match ? parseInt(match[1], 10) : 0;
      }))
      : 0;
    const proximoNumero = (numeroExistente + 1).toString().padStart(3, '0');
    return `OBRA-${anoAtual}-${proximoNumero}`;
  };

  return {
    criarObra,
    atualizarObra,
    arquivarObra,
    atribuirUsuario,
    removerUsuario,
    gerarCodigoObra,
  };
};
