import { useState, useEffect } from "react";
import { useAuth } from "@/context/SupabaseAuthContext";
import { useObras } from "@/hooks/useObras";
import { useUserRole } from "@/context/UserRoleContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusCircle, FileEdit, Users, ArchiveIcon, Search, Filter, FileUp } from "lucide-react";
import NovaObraDialog from "@/components/obras/NovaObraDialog";
import EditarObraDialog from "@/components/obras/EditarObraDialog";
import AtribuirUsuariosDialog from "@/components/obras/AtribuirUsuariosDialog";
import type { Obra, ObraStatus, NivelPBQPH } from "@/types/obra";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Obras = () => {
  const { user } = useAuth();
  const { currentUserRole } = useUserRole();
  const { obras, getObrasDoUsuario, arquivarObra } = useObras();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [nivelFilter, setNivelFilter] = useState<string>("");
  const [filteredObras, setFilteredObras] = useState<Obra[]>([]);
  
  const [showNovaObraDialog, setShowNovaObraDialog] = useState(false);
  const [showEditarObraDialog, setShowEditarObraDialog] = useState(false);
  const [showAtribuirUsuariosDialog, setShowAtribuirUsuariosDialog] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);
  
  const isAdmin = currentUserRole?.id === "admin";
  const obrasDoUsuario = getObrasDoUsuario();

  // Filter obras based on search and filters
  useEffect(() => {
    let result = [...obrasDoUsuario];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(obra => 
        obra.nome.toLowerCase().includes(term) || 
        obra.codigoDaObra.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(obra => obra.status === statusFilter);
    }
    
    // Apply nivel filter
    if (nivelFilter) {
      result = result.filter(obra => obra.nivelPBQPH === nivelFilter);
    }
    
    setFilteredObras(result);
  }, [searchTerm, statusFilter, nivelFilter, obrasDoUsuario]);

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
  
  const handleVisualizarAnexos = (obra: Obra) => {
    if (!obra.anexosObra || obra.anexosObra.length === 0) {
      toast({
        title: "Sem anexos",
        description: "Esta obra não possui anexos.",
      });
      return;
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
  
  const getNivelPBQPHBadge = (nivel?: string) => {
    switch (nivel) {
      case "Nível A":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Nível A</Badge>;
      case "Nível B":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nível B</Badge>;
      case "Não Aplicável":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Não Aplicável</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Não Aplicável</Badge>;
    }
  };

  const statusOptions: { value: ObraStatus; label: string }[] = [
    { value: "planejamento", label: "Planejamento" },
    { value: "em_andamento", label: "Em Andamento" },
    { value: "concluida", label: "Concluída" },
    { value: "suspensa", label: "Suspensa" },
    { value: "arquivada", label: "Arquivada" },
  ];

  const nivelOptions: { value: NivelPBQPH; label: string }[] = [
    { value: "Nível A", label: "Nível A" },
    { value: "Nível B", label: "Nível B" },
    { value: "Não Aplicável", label: "Não Aplicável" },
  ];

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
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Nível PBQP-H</p>
                <Select
                  value={nivelFilter}
                  onValueChange={setNivelFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os níveis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {nivelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setStatusFilter("");
                  setNivelFilter("");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {filteredObras.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <h3 className="text-lg font-medium">Nenhuma obra encontrada</h3>
          <p className="text-muted-foreground mt-1">
            {obrasDoUsuario.length === 0 
              ? (isAdmin 
                ? "Clique no botão 'Nova Obra' para cadastrar uma obra." 
                : "Você não possui permissão para visualizar obras ou não foi atribuído a nenhuma obra ainda.")
              : "Tente ajustar os filtros ou termos de busca para encontrar o que procura."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nível PBQP-H</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Anexos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObras.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell className="font-medium">{obra.codigoDaObra}</TableCell>
                    <TableCell>{obra.nome}</TableCell>
                    <TableCell>{obra.localizacao}</TableCell>
                    <TableCell>
                      {format(new Date(obra.dataInicio), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{getStatusBadge(obra.status)}</TableCell>
                    <TableCell>{getNivelPBQPHBadge(obra.nivelPBQPH)}</TableCell>
                    <TableCell>{obra.usuarios.length}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVisualizarAnexos(obra)}
                        disabled={!obra.anexosObra || obra.anexosObra.length === 0}
                      >
                        <FileUp className="h-4 w-4 mr-1" />
                        {obra.anexosObra?.length || 0}
                      </Button>
                    </TableCell>
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
