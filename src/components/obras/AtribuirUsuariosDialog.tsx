
import { useState, useEffect } from "react";
import { useObras } from "@/hooks/useObras";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { ObraUsuario } from "@/context/ObrasContext";

const usuarioFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  funcao: z.string().min(2, { message: "Função é obrigatória" }),
});

interface AtribuirUsuariosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obraId: string;
}

export default function AtribuirUsuariosDialog({ open, onOpenChange, obraId }: AtribuirUsuariosDialogProps) {
  const { obras, atribuirUsuario, removerUsuario } = useObras();
  const [obra, setObra] = useState(() => obras.find(o => o.id === obraId));
  
  useEffect(() => {
    setObra(obras.find(o => o.id === obraId));
  }, [obraId, obras]);
  
  const form = useForm<z.infer<typeof usuarioFormSchema>>({
    resolver: zodResolver(usuarioFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      funcao: "",
    },
  });
  
  const funcoes = [
    { label: "Engenheiro Responsável", value: "engenheiro_responsavel" },
    { label: "Inspetor", value: "inspetor" },
    { label: "RD", value: "rd" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Técnico", value: "tecnico" },
  ];

  const handleSubmit = (values: z.infer<typeof usuarioFormSchema>) => {
    if (!obra) return;
    
    // Simular a adição de um usuário ao sistema (em uma implementação real, usaria a API do Clerk)
    const novoUsuario: ObraUsuario = {
      userId: Date.now().toString(), // Na implementação real seria o ID do usuário no Clerk
      nome: values.nome,
      email: values.email,
      funcao: values.funcao,
    };
    
    atribuirUsuario(obraId, novoUsuario);
    
    toast({
      title: "Usuário adicionado",
      description: `${values.nome} foi adicionado à obra.`,
    });
    
    form.reset();
  };
  
  const handleRemoverUsuario = (userId: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${nome} da obra?`)) {
      removerUsuario(obraId, userId);
      
      toast({
        title: "Usuário removido",
        description: `${nome} foi removido da obra.`,
      });
    }
  };
  
  if (!obra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Usuários da Obra: {obra.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Formulário para adicionar usuário */}
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Adicionar Usuário</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="funcao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {funcoes.map((funcao) => (
                              <SelectItem key={funcao.value} value={funcao.value}>
                                {funcao.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit">Adicionar</Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Lista de usuários */}
          <div>
            <h3 className="text-lg font-medium mb-4">Usuários Atribuídos</h3>
            
            {obra.usuarios.length === 0 ? (
              <div className="text-center p-4 border rounded-md">
                <p className="text-muted-foreground">
                  Nenhum usuário atribuído a esta obra.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obra.usuarios.map((usuario) => {
                    const funcaoLabel = funcoes.find(f => f.value === usuario.funcao)?.label || usuario.funcao;
                    
                    return (
                      <TableRow key={usuario.userId}>
                        <TableCell>{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{funcaoLabel}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => handleRemoverUsuario(usuario.userId, usuario.nome)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
