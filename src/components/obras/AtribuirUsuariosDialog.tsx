
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useObras } from "@/context/ObrasContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Usuario } from "@/types/obra";
import { X, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Usuários fictícios para simulação
const usuariosDisponiveis: Usuario[] = [
  { id: "user1", nome: "João Silva", email: "joao.silva@exemplo.com" },
  { id: "user2", nome: "Maria Costa", email: "maria.costa@exemplo.com" },
  { id: "user3", nome: "Pedro Santos", email: "pedro.santos@exemplo.com" },
  { id: "user4", nome: "Ana Pereira", email: "ana.pereira@exemplo.com" },
];

const funcoes = [
  "Engenheiro responsável",
  "Técnico de segurança",
  "Inspetor de qualidade",
  "Representante da direção",
  "Coordenador",
  "Gerente de obra"
];

interface AtribuirUsuariosDialogProps {
  obraId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AtribuirUsuariosDialog({ obraId, open, onOpenChange }: AtribuirUsuariosDialogProps) {
  const { obras, atribuirUsuario, removerUsuario } = useObras();
  const obra = obras.find(o => o.id === obraId);
  
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>("");
  const [funcaoSelecionada, setFuncaoSelecionada] = useState<string>("");
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  
  // Filtrar usuários que já não estejam atribuídos à obra
  useEffect(() => {
    if (!obra) return;
    
    const usuariosJaAtribuidos = new Set(obra.usuarios.map(u => u.usuario.id));
    
    const filtrados = usuariosDisponiveis
      .filter(u => !usuariosJaAtribuidos.has(u.id))
      .filter(u => 
        u.nome.toLowerCase().includes(filtro.toLowerCase()) || 
        u.email.toLowerCase().includes(filtro.toLowerCase())
      );
      
    setUsuariosFiltrados(filtrados);
  }, [obra, filtro]);
  
  if (!obra) return null;

  const handleAtribuir = () => {
    if (!usuarioSelecionado || !funcaoSelecionada) {
      toast({
        title: "Informações incompletas",
        description: "Selecione um usuário e uma função para atribuir à obra.",
        variant: "destructive",
      });
      return;
    }
    
    const usuario = usuariosDisponiveis.find(u => u.id === usuarioSelecionado);
    if (!usuario) return;
    
    atribuirUsuario(obraId, usuario, funcaoSelecionada);
    
    toast({
      title: "Usuário atribuído",
      description: `${usuario.nome} foi atribuído como ${funcaoSelecionada} à obra.`,
    });
    
    setUsuarioSelecionado("");
    setFuncaoSelecionada("");
  };
  
  const handleRemover = (usuarioId: string) => {
    const usuarioObra = obra.usuarios.find(u => u.usuario.id === usuarioId);
    if (!usuarioObra) return;
    
    removerUsuario(obraId, usuarioId);
    
    toast({
      title: "Usuário removido",
      description: `${usuarioObra.usuario.nome} foi removido da obra.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Equipe</DialogTitle>
          <DialogDescription>
            Atribua usuários à obra: {obra.nome}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuário</Label>
              <div className="relative">
                <Input
                  id="filtro"
                  placeholder="Filtrar usuários..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="mb-2"
                />
                <Select onValueChange={setUsuarioSelecionado} value={usuarioSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuariosFiltrados.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum usuário disponível
                      </SelectItem>
                    ) : (
                      usuariosFiltrados.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="funcao">Função</Label>
              <Select onValueChange={setFuncaoSelecionada} value={funcaoSelecionada}>
                <SelectTrigger id="funcao">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {funcoes.map((funcao) => (
                    <SelectItem key={funcao} value={funcao}>
                      {funcao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleAtribuir} 
              disabled={!usuarioSelecionado || !funcaoSelecionada}
              className="mb-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Equipe Atual</h3>
            {obra.usuarios.length === 0 ? (
              <p className="text-muted-foreground">Nenhum membro atribuído a esta obra.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obra.usuarios.map((usuarioObra) => (
                    <TableRow key={usuarioObra.usuario.id}>
                      <TableCell>{usuarioObra.usuario.nome}</TableCell>
                      <TableCell>{usuarioObra.usuario.email}</TableCell>
                      <TableCell>{usuarioObra.funcao}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemover(usuarioObra.usuario.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Concluído
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
