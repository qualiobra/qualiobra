
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { LeadCadastro } from "@/types/obra";

// Schema do formulário
const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(10, { message: "Telefone inválido" }),
  cargo: z.string().min(2, { message: "Informe seu cargo" }),
  empresa: z.string().min(2, { message: "Informe o nome da empresa" }),
  porteEmpresa: z.enum(["micro", "pequena", "media", "grande"], {
    required_error: "Selecione o porte da empresa",
  }),
  numeroObras: z.string().min(1, { message: "Informe o número de obras" }),
  segmentoAtuacao: z.string().min(2, { message: "Informe o segmento de atuação" }),
  interesseEmCertificacao: z.boolean().default(false),
});

const AvaliacaoInicial = () => {
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cargo: "",
      empresa: "",
      numeroObras: "",
      segmentoAtuacao: "",
      interesseEmCertificacao: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      // Simular envio para API/backend
      console.log("Dados do formulário:", data);
      
      // Simulação de um código de verificação
      const codigoVerificacao = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const lead: LeadCadastro = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cargo: data.cargo,
        empresa: data.empresa,
        porteEmpresa: data.porteEmpresa,
        numeroObras: data.numeroObras,
        segmentoAtuacao: data.segmentoAtuacao,
        interesseEmCertificacao: data.interesseEmCertificacao,
        emailVerificado: false,
        codigoVerificacao: codigoVerificacao,
      };
      
      // Em produção, aqui seria o código para salvar no banco de dados
      localStorage.setItem("leadCadastro", JSON.stringify(lead));
      
      // Simulação de envio de email
      setTimeout(() => {
        setSubmitting(false);
        setEmailSent(true);
        toast({
          title: "E-mail de verificação enviado!",
          description: "Verifique sua caixa de entrada para confirmar seu registro.",
        });
      }, 1500);
    } catch (error) {
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
      });
    }
  }

  const verificarCodigo = (codigo: string) => {
    const leadSalvo = localStorage.getItem("leadCadastro");
    if (!leadSalvo) return;
    
    const lead: LeadCadastro = JSON.parse(leadSalvo);
    if (lead.codigoVerificacao === codigo) {
      lead.emailVerificado = true;
      localStorage.setItem("leadCadastro", JSON.stringify(lead));
      toast({
        title: "Email verificado com sucesso!",
        description: "Você será redirecionado para o diagnóstico PBQP-H.",
      });
      
      // Redirecionamento para o diagnóstico
      setTimeout(() => {
        navigate("/diagnostico");
      }, 2000);
    } else {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "O código informado não é válido. Verifique e tente novamente.",
      });
    }
  };

  const handleReenviarEmail = () => {
    toast({
      title: "Email reenviado!",
      description: "Verifique sua caixa de entrada para o código de verificação.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Avaliação Inicial Gratuita PBQP-H</h1>
          <p className="text-lg text-muted-foreground">
            Descubra como sua empresa está em relação aos requisitos do Programa Brasileiro de Qualidade e Produtividade do Habitat.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Diagnóstico Completo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Avaliação baseada nos critérios oficiais do PBQP-H.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Relatório Detalhado</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Receba um documento com a análise completa e pontuação por requisito.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Consultoria Especializada</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Orientação profissional para melhorar os pontos críticos identificados.</p>
            </CardContent>
          </Card>
        </div>

        {!emailSent ? (
          <Card>
            <CardHeader>
              <CardTitle>Cadastre-se para acessar o diagnóstico</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para iniciar sua avaliação gratuita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
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
                            <Input placeholder="seu.email@empresa.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu cargo na empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da sua empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="porteEmpresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porte da empresa</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o porte da empresa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="micro">Microempresa</SelectItem>
                              <SelectItem value="pequena">Pequena empresa</SelectItem>
                              <SelectItem value="media">Média empresa</SelectItem>
                              <SelectItem value="grande">Grande empresa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numeroObras"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de obras em andamento</FormLabel>
                          <FormControl>
                            <Input placeholder="Quantidade de obras" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="segmentoAtuacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Segmento de atuação</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Residencial, Comercial, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="interesseEmCertificacao"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Tenho interesse em certificação PBQP-H
                          </FormLabel>
                          <FormDescription>
                            Gostaria de receber informações sobre como obter a certificação PBQP-H
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Enviando..." : "Iniciar Avaliação Gratuita"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Verifique seu email</CardTitle>
              <CardDescription>
                Enviamos um código de verificação para o email informado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Por favor, verifique sua caixa de entrada e insira o código de verificação abaixo 
                  para continuar com o diagnóstico PBQP-H.
                </p>
                
                <div className="flex space-x-4">
                  <Input 
                    placeholder="Digite o código de verificação" 
                    className="flex-1"
                    id="verificationCode"
                  />
                  <Button 
                    onClick={() => {
                      const input = document.getElementById("verificationCode") as HTMLInputElement;
                      verificarCodigo(input.value);
                    }}
                  >
                    Verificar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReenviarEmail}>
                Reenviar código
              </Button>
              <Button variant="ghost" onClick={() => setEmailSent(false)}>
                Voltar ao formulário
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AvaliacaoInicial;
