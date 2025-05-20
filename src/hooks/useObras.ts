import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useUserRole } from "@/context/UserRoleContext";
import type { Obra, ObraUsuario, ObraAnexo } from "@/types/obra";

const mockObras: Obra[] = [
  {
    id: "1",
    nome: "Residencial das Flores",
    codigoDaObra: "RF-2023-001",
    descricao: "Construção de um condomínio residencial de alto padrão.",
    localizacao: "Rua das Rosas, 123 - Jardim Primavera",
    status: "em_andamento",
    dataInicio: "2023-03-15",
    dataPrevistaTermino: "2024-12-31",
    nivelPBQPH: "Nível A",
    usuarios: [
      {
        userId: "user1",
        nome: "João da Silva",
        email: "joao.silva@example.com",
        funcao: "Engenheiro Responsável",
		roleId: "engenheiro_gestor",
        telefoneWhatsApp: "+5511999999999",
      },
      {
        userId: "user2",
        nome: "Maria Souza",
        email: "maria.souza@example.com",
        funcao: "Arquiteta",
		roleId: "equipe_inspecao",
        telefoneWhatsApp: "+5511988888888",
      },
    ],
    anexosObra: [
      {
        nome: "Projeto Arquitetônico",
        url: "https://example.com/projetos/RF-2023-001/arquitetonico.pdf",
        tipo: "Projeto",
      },
      {
        nome: "Licença Ambiental",
        url: "https://example.com/projetos/RF-2023-001/ambiental.pdf",
        tipo: "Licença",
      },
    ],
  },
  {
    id: "2",
    nome: "Edifício Comercial Platinum",
    codigoDaObra: "ECP-2023-002",
    descricao: "Construção de um edifício comercial com escritórios e lojas.",
    localizacao: "Avenida Paulista, 500 - Centro",
    status: "planejamento",
    dataInicio: "2024-01-10",
    dataPrevistaTermino: "2025-07-30",
    nivelPBQPH: "Nível B",
    usuarios: [
      {
        userId: "user3",
        nome: "Carlos Pereira",
        email: "carlos.pereira@example.com",
        funcao: "Engenheiro Civil",
		roleId: "engenheiro_gestor",
        telefoneWhatsApp: "+5511977777777",
      },
    ],
    anexosObra: [
      {
        nome: "Orçamento Detalhado",
        url: "https://example.com/projetos/ECP-2023-002/orcamento.xlsx",
        tipo: "Orçamento",
      },
    ],
  },
  {
    id: "3",
    nome: "Reforma da Escola Municipal",
    codigoDaObra: "REM-2023-003",
    descricao: "Reforma geral da escola municipal, incluindo novas instalações.",
    localizacao: "Rua dos Estudantes, 10 - Vila Nova",
    status: "concluida",
    dataInicio: "2023-06-01",
    dataPrevistaTermino: "2023-11-20",
    nivelPBQPH: "Não Aplicável",
    usuarios: [
      {
        userId: "user4",
        nome: "Ana Clara",
        email: "ana.clara@example.com",
        funcao: "Mestre de Obras",
		roleId: "equipe_inspecao",
        telefoneWhatsApp: "+5511966666666",
      },
    ],
    anexosObra: [
      {
        nome: "Relatório Final da Reforma",
        url: "https://example.com/projetos/REM-2023-003/relatorio.pdf",
        tipo: "Relatório",
      },
    ],
  },
];

export const useObras = () => {
  const { user } = useUser();
  const { currentUserRole } = useUserRole();
  const [obras, setObras] = useState<Obra[]>(() => {
    const savedObras = localStorage.getItem("obras");
    return savedObras ? JSON.parse(savedObras) : mockObras;
  });

  useEffect(() => {
    localStorage.setItem("obras", JSON.stringify(obras));
  }, [obras]);

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

  const getObrasDoUsuario = (): Obra[] => {
    if (!user) return [];

    if (currentUserRole?.id === "admin") {
      return obras;
    }

    return obras.filter((obra) =>
      obra.usuarios.some((usuario) => usuario.email === user.emailAddresses[0].emailAddress)
    );
  };

  return {
    obras,
    criarObra,
    atualizarObra,
    arquivarObra,
	atribuirUsuario,
	removerUsuario,
    getObrasDoUsuario,
  };
};
