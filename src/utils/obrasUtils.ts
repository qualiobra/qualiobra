
import { Obra, Usuario, UsuarioObra, StatusObra, Documento } from "../types/obra";

// Função para adicionar um usuário a uma obra
export const adicionarUsuarioAObra = (
  obra: Obra, 
  usuario: Usuario, 
  funcao: string
): Obra => {
  // Remove o usuário se já existir e adiciona com a nova função
  const usuariosAtualizados = obra.usuarios
    .filter(u => u.usuario.id !== usuario.id)
    .concat({ usuario, funcao });
    
  return { ...obra, usuarios: usuariosAtualizados };
};

// Função para remover um usuário de uma obra
export const removerUsuarioDeObra = (
  obra: Obra,
  usuarioId: string
): Obra => {
  return {
    ...obra,
    usuarios: obra.usuarios.filter(u => u.usuario.id !== usuarioId)
  };
};

// Função para adicionar documento a uma obra
export const adicionarDocumentoAObra = (
  obra: Obra,
  documento: Omit<Documento, "id" | "dataUpload">
): Obra => {
  const novoDocumento: Documento = {
    ...documento,
    id: Date.now().toString(),
    dataUpload: new Date().toISOString().split('T')[0]
  };

  return {
    ...obra,
    documentos: [...obra.documentos, novoDocumento]
  };
};

// Função para remover documento de uma obra
export const removerDocumentoDeObra = (
  obra: Obra,
  documentoId: string
): Obra => {
  return {
    ...obra,
    documentos: obra.documentos.filter(d => d.id !== documentoId)
  };
};

// Dados de exemplo para obras
export const obrasIniciais: Obra[] = [
  {
    id: "1",
    nome: "Edifício Residence Park",
    descricao: "Construção de edifício residencial com 12 andares",
    localizacao: "Av. Paulista, 1000 - São Paulo/SP",
    dataInicio: "2023-10-15",
    status: "em_andamento",
    documentos: [
      {
        id: "doc1",
        nome: "Planta baixa",
        tipo: "pdf",
        url: "/documentos/planta.pdf",
        dataUpload: "2023-10-15"
      }
    ],
    usuarios: []
  },
  {
    id: "2",
    nome: "Reforma Hospital Santa Casa",
    descricao: "Reforma da ala pediátrica",
    localizacao: "Rua das Flores, 500 - Rio de Janeiro/RJ",
    dataInicio: "2023-09-01",
    status: "em_andamento",
    documentos: [],
    usuarios: []
  }
];
