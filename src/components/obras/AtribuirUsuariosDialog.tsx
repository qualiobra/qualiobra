
import { useState, useEffect } from "react";
import { useObras } from "@/hooks/useObras";
import { useUserRole } from "@/context/UserRoleContext";
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
import { Trash2, HelpCircle } from "lucide-react";
import { ObraUsuario } from "@/context/ObrasContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const usuarioFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  funcao: z.string().min(2, { message: "Função é obrigatória" }),
  telefoneWhatsApp: z.string().optional(),
});

interface AtribuirUsuariosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obraId: string;
}

export default function AtribuirUsuariosDialog({ open, onOpenChange, obraId }: AtribuirUsuariosDialogProps) {
  const { obras, atribuirUsuario, removerUsuario } = useObras();
  const { userRoles } = useUserRole();
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
      telefoneWhatsApp: "",
    },
  });
  
  // Funções mapeadas para perfis do sistema
  const funcoes = [
    { 
      label: "Engenheiro Responsável", 
      value: "engenheiro_responsavel",
      roleId: "engenheiro_gestor",
      description: "Tem acesso total à obra e pode gerenciar formulários e inspeções"
    },
    { 
      label: "Inspetor", 
      value: "inspetor",
      roleId: "equipe_inspecao", 
      description: "Pode realizar inspeções e visualizar dados da obra"
    },
    { 
      label: "RD", 
      value: "rd",
      roleId: "equipe_inspecao", 
      description: "Representante da Direção - pode realizar inspeções"
    },
    { 
      label: "Supervisor", 
      value: "supervisor",
      roleId: "engenheiro_gestor", 
      description: "Gerencia a equipe e aprova inspeções"
    },
    { 
      label: "Técnico", 
      value: "tecnico",
      roleId: "equipe_inspecao", 
      description: "Técnico de qualidade - realiza inspeções"
    },
  ];

  const handleSubmit = (values: z.infer<typeof usuarioFormSchema>) => {
    if (!obra) return;
    
    // Obter roleId correspondente à função selecionada
    const funcaoSelecionada = funcoes.find(f => f.value === values.funcao);
    const roleId = funcaoSelecionada?.roleId || "equipe_inspecao"; // Padrão para equipe de inspeção
    
    // Simular a adição de um usuário ao sistema
    const novoUsuario: ObraUsuario = {
      userId: Date.now().toString(), // Na implementação real seria o ID do usuário no Clerk
      nome: values.nome,
      email: values.email,
      funcao: values.funcao,
      telefoneWhatsApp: values.telefoneWhatsApp || "",
      roleId: roleId, // Adicionando roleId mapeado da função
    };
    
    atribuirUsuario(obraId, novoUsuario);
    
    toast({
      title: "Usuário adicionado",
      description: `${values.nome} foi adicionado à obra como ${funcaoSelecionada?.label}.`,
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefoneWhatsApp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone/WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+55 00 00000-0000" {...field} />
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
                        <FormLabel className="flex items-center gap-2">
                          Função 
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>A função define as permissões do usuário na obra</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
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
                                <div>
                                  <span>{funcao.label}</span>
                                  <p className="text-xs text-muted-foreground">{funcao.description}</p>
                                </div>
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
                    <TableHead>Telefone</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obra.usuarios.map((usuario) => {
                    const funcaoInfo = funcoes.find(f => f.value === usuario.funcao);
                    const funcaoLabel = funcaoInfo?.label || usuario.funcao;
                    const roleInfo = userRoles.find(r => r.id === (funcaoInfo?.roleId || usuario.roleId));
                    
                    return (
                      <TableRow key={usuario.userId}>
                        <TableCell>{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.telefoneWhatsApp || "-"}</TableCell>
                        <TableCell>{funcaoLabel}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full
                            ${roleInfo?.id === "admin" ? "bg-purple-100 text-purple-800" : 
                              roleInfo?.id === "engenheiro_gestor" ? "bg-blue-100 text-blue-800" :
                              "bg-green-100 text-green-800"}`}>
                            {roleInfo?.name || "Usuário"}
                          </span>
                        </TableCell>
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
