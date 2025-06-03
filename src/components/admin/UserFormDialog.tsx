
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormData } from "./schemas/userFormSchema";
import { Profile } from "@/hooks/useSupabaseUsers";

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: Profile | null;
  onSubmit: (data: UserFormData) => void;
}

export const UserFormDialog = ({
  isOpen,
  onOpenChange,
  editingUser,
  onSubmit,
}: UserFormDialogProps) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      telefone: "",
      password: "",
      role: "",
      isEngenheiro: false,
      crea: "",
      especialidade: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (editingUser) {
      form.reset({
        firstName: editingUser.first_name || "",
        lastName: editingUser.last_name || "",
        email: editingUser.email || "",
        telefone: editingUser.telefone || "",
        password: "",
        role: editingUser.role || "user",
        isEngenheiro: editingUser.is_engenheiro || false,
        crea: editingUser.crea || "",
        especialidade: editingUser.especialidade || "",
        status: editingUser.status as "active" | "inactive" || "active",
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        telefone: "",
        password: "",
        role: "",
        isEngenheiro: false,
        crea: "",
        especialidade: "",
        status: "active",
      });
    }
  }, [editingUser, form]);

  const handleSubmit = (values: UserFormData) => {
    onSubmit(values);
    form.reset();
  };

  const isEngenheiroChecked = form.watch("isEngenheiro");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {editingUser 
              ? "Edite as informações do usuário conforme necessário."
              : "Preencha os detalhes para criar um novo usuário no sistema."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@exemplo.com" 
                      {...field} 
                      disabled={!!editingUser}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{editingUser ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={editingUser ? "Deixe em branco para manter" : "Senha temporária"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        {...field}
                      >
                        <option value="" disabled>Selecione um perfil</option>
                        <option value="admin">Administrador</option>
                        <option value="user">Usuário</option>
                        <option value="engenheiro">Engenheiro</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editingUser && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          {...field}
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <FormField
              control={form.control}
              name="isEngenheiro"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>É engenheiro</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {isEngenheiroChecked && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="crea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CREA</FormLabel>
                      <FormControl>
                        <Input placeholder="CREA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="especialidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Especialidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingUser ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
