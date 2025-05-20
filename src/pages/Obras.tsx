
import React, { useState } from "react";
import { useObras } from "@/hooks/useObras";
import { useUserRole } from "@/context/UserRoleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Archive, User } from "lucide-react";
import { NovaObraDialog } from "@/components/obras/NovaObraDialog";
import { EditarObraDialog } from "@/components/obras/EditarObraDialog";
import { AtribuirUsuariosDialog } from "@/components/obras/AtribuirUsuariosDialog";

export default function Obras() {
  const { obrasDoUsuario, carregando, arquivarObra } = useObras();
  const { currentUserRole } = useUserRole();
  const [obraParaEditar, setObraParaEditar] = useState<string | null>(null);
  const [obraParaAtribuir, setObraParaAtribuir] = useState<string | null>(null);
  const [showNovaObraDialog, setShowNovaObraDialog] = useState(false);

  const isAdmin = currentUserRole?.permissions.includes('all') || false;

  const obrasAtivas = obrasDoUsuario.filter(obra => obra.status !== 'arquivada');
  const obrasArquivadas = obrasDoUsuario.filter(obra => obra.status === 'arquivada');

  const formatarStatus = (status: string) => {
    switch (status) {
      case 'em_andamento': return { label: 'Em andamento', variant: 'default' as const };
      case 'concluida': return { label: 'Concluída', variant: 'secondary' as const };
      case 'paralisada': return { label: 'Paralisada', variant: 'outline' as const };
      case 'arquivada': return { label: 'Arquivada', variant: 'secondary' as const };
      default: return { label: status, variant: 'default' as const };
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Obras</h1>
        {isAdmin && (
          <Button onClick={() => setShowNovaObraDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Obra
          </Button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Obras Ativas</h2>
      {obrasAtivas.length === 0 ? (
        <p className="text-muted-foreground mb-8">Nenhuma obra ativa encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {obrasAtivas.map((obra) => (
            <Card key={obra.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{obra.nome}</CardTitle>
                  <Badge variant={formatarStatus(obra.status).variant}>
                    {formatarStatus(obra.status).label}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-1">{obra.localizacao}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{obra.descricao}</p>
                <div className="text-xs text-muted-foreground">
                  <p>Data de início: {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}</p>
                  <p>Documentos: {obra.documentos.length}</p>
                  <p>Equipe: {obra.usuarios.length} membros</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2 border-t">
                {isAdmin && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setObraParaAtribuir(obra.id)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setObraParaEditar(obra.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => arquivarObra(obra.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.location.href = `/obras/${obra.id}`}
                >
                  Visualizar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {obrasArquivadas.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Obras Arquivadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {obrasArquivadas.map((obra) => (
              <Card key={obra.id} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{obra.nome}</CardTitle>
                    <Badge variant="secondary">Arquivada</Badge>
                  </div>
                  <CardDescription>{obra.localizacao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{obra.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Iniciada em {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/obras/${obra.id}`}
                  >
                    Visualizar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      <NovaObraDialog 
        open={showNovaObraDialog} 
        onOpenChange={setShowNovaObraDialog} 
      />
      
      {obraParaEditar && (
        <EditarObraDialog 
          obraId={obraParaEditar} 
          open={!!obraParaEditar} 
          onOpenChange={(open) => !open && setObraParaEditar(null)} 
        />
      )}
      
      {obraParaAtribuir && (
        <AtribuirUsuariosDialog 
          obraId={obraParaAtribuir} 
          open={!!obraParaAtribuir} 
          onOpenChange={(open) => !open && setObraParaAtribuir(null)} 
        />
      )}
    </div>
  );
}
