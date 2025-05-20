
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useObras } from "@/hooks/useObras";
import { useUserRole } from "@/context/UserRoleContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusCircle, FileEdit, Users, ArchiveIcon } from "lucide-react";
import NovaObraDialog from "@/components/obras/NovaObraDialog";
import EditarObraDialog from "@/components/obras/EditarObraDialog";
import AtribuirUsuariosDialog from "@/components/obras/AtribuirUsuariosDialog";
import { type Obra } from "@/context/ObrasContext";
import { toast } from "@/hooks/use-toast";

const Obras = () => {
  const { user } = useUser();
  const { currentUserRole } = useUserRole();
  const { obras, getObrasDoUsuario, arquivarObra } = useObras();
  
  const [showNovaObraDialog, setShowNovaObraDialog] = useState(false);
  const [showEditarObraDialog, setShowEditarObraDialog] = useState(false);
  const [showAtribuirUsuariosDialog, setShowAtribuirUsuariosDialog] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);
  
  const isAdmin = currentUserRole?.id === "admin";
  const obrasDoUsuario = getObrasDoUsuario();

  const handleEditarObra = (obra: Obra) => {
    setSelectedObraId(obra.id);
    setShowEditarObraDialog(true);
  };
  
  const handleAtribuirUsuarios = (obra: Obra) => {
    setSelectedObraId(obra.id);
    setShowAtribuirUsuariosDialog(true);
  };
  
  const handleArquivarObra = (obra: Obra) => {
    if (window.confirm(`Tem certeza que deseja arquivar a obra ${obra.nome}?`)) {
      arquivarObra(obra.id);
      toast({
        title: "Obra arquivada",
        description: `A obra ${obra.nome} foi arquivada com sucesso.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planejamento":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planejamento</Badge>;
      case "em_andamento":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Em andamento</Badge>;
      case "concluida":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Concluída</Badge>;
      case "suspensa":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Suspensa</Badge>;
      case "arquivada":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Arquivada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Obras</h1>
          <p className="text-muted-foreground">
            Gerencie as obras da sua empresa
          </p>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setShowNovaObraDialog(true)} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Nova Obra
          </Button>
        )}
      </div>

      {obrasDoUsuario.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <h3 className="text-lg font-medium">Nenhuma obra cadastrada</h3>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Clique no botão 'Nova Obra' para cadastrar uma obra." 
              : "Você não possui permissão para visualizar obras ou não foi atribuído a nenhuma obra ainda."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obrasDoUsuario.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell className="font-medium">{obra.nome}</TableCell>
                  <TableCell>{obra.localizacao}</TableCell>
                  <TableCell>
                    {format(new Date(obra.dataInicio), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{getStatusBadge(obra.status)}</TableCell>
                  <TableCell>{obra.usuarios.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {isAdmin && obra.status !== "arquivada" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditarObra(obra)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAtribuirUsuarios(obra)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleArquivarObra(obra)}
                          >
                            <ArchiveIcon className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogos */}
      <NovaObraDialog 
        open={showNovaObraDialog} 
        onOpenChange={setShowNovaObraDialog} 
      />
      
      {selectedObraId && (
        <>
          <EditarObraDialog 
            open={showEditarObraDialog} 
            onOpenChange={setShowEditarObraDialog}
            obraId={selectedObraId}
          />
          
          <AtribuirUsuariosDialog 
            open={showAtribuirUsuariosDialog} 
            onOpenChange={setShowAtribuirUsuariosDialog}
            obraId={selectedObraId}
          />
        </>
      )}
    </div>
  );
};

export default Obras;
