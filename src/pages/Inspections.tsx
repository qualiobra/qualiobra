
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { ClipboardCheck, Search, Plus, Filter, MoreHorizontal, FileText } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import { toast } from "@/hooks/use-toast";

const inspectionTemplates = [
  { id: 1, name: "Inspeção Estrutural", category: "Estrutural", items: 24 },
  { id: 2, name: "Sistemas Elétricos", category: "Elétrico", items: 18 },
  { id: 3, name: "Instalação Hidráulica", category: "Hidráulico", items: 15 },
  { id: 4, name: "Serviços de Acabamento", category: "Acabamento", items: 22 },
  { id: 5, name: "Inspeção de Fundação", category: "Estrutural", items: 20 },
  { id: 6, name: "Conformidade com Segurança contra Incêndio", category: "Segurança", items: 16 },
];

const sampleInspections = [
  { 
    id: 1, 
    title: "Inspeção de Fundação", 
    site: "Torre Residencial A", 
    date: "2023-05-19", 
    status: "Completed", 
    compliance: 92,
    inspector: "João Silva" 
  },
  { 
    id: 2, 
    title: "Sistemas Elétricos", 
    site: "Edifício Comercial B", 
    date: "2023-05-18", 
    status: "In Progress", 
    compliance: 78,
    inspector: "Maria Oliveira" 
  },
  { 
    id: 3, 
    title: "Instalação Hidráulica", 
    site: "Torre Residencial A", 
    date: "2023-05-17", 
    status: "Draft", 
    compliance: 0,
    inspector: "Carlos Santos" 
  },
  { 
    id: 4, 
    title: "Estrutura", 
    site: "Shopping Center C", 
    date: "2023-05-16", 
    status: "Completed", 
    compliance: 86,
    inspector: "Ana Pereira" 
  },
  { 
    id: 5, 
    title: "Serviços de Acabamento", 
    site: "Projeto Hotel D", 
    date: "2023-05-15", 
    status: "Completed", 
    compliance: 88,
    inspector: "Roberto Costa" 
  }
];

type NewInspectionFormValues = {
  title: string;
  site: string;
  template: string;
  assignee: string;
};

const Inspections = () => {
  const [activeTab, setActiveTab] = useState<string>("inspections");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const form = useForm<NewInspectionFormValues>({
    defaultValues: {
      title: "",
      site: "",
      template: "",
      assignee: "",
    }
  });

  const onSubmit = (data: NewInspectionFormValues) => {
    console.log(data);
    toast({
      title: "Inspeção Criada",
      description: `Nova inspeção "${data.title}" foi criada`,
    });
    setOpenDialog(false);
    form.reset();
  };

  const handleStartInspection = (templateId: number) => {
    const template = inspectionTemplates.find(t => t.id === templateId);
    if (template) {
      setOpenDialog(true);
      form.setValue("title", template.name);
      form.setValue("template", String(templateId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluída</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Andamento</Badge>;
      case "Draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Rascunho</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspeções</h1>
            <p className="text-gray-600">Gerencie e crie inspeções de qualidade para todos os seus projetos</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Inspeção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Inspeção</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para iniciar uma nova inspeção de qualidade
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Inspeção</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título da inspeção" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="site"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Canteiro de Obras</FormLabel>
                        <FormControl>
                          <Input placeholder="Selecione o canteiro de obras" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Selecione o modelo de inspeção" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspetor Designado</FormLabel>
                        <FormControl>
                          <Input placeholder="Selecione o inspetor" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="submit">Criar Inspeção</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="inspections">
              <ClipboardCheck className="mr-2 h-4 w-4" /> Inspeções
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" /> Modelos
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="mr-2 h-4 w-4" /> Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 my-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar inspeções..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Inspections Tab Content */}
          <TabsContent value="inspections" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sampleInspections.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{inspection.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{inspection.site}</p>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(inspection.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Baixar Relatório</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Data: {new Date(inspection.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>Inspetor: {inspection.inspector}</span>
                        </div>
                        {inspection.status === "Completed" && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">Conformidade:</span>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {inspection.compliance}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {inspection.status === "Draft" && (
                      <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 border-t md:border-t-0 md:border-l">
                        <Button>Continuar</Button>
                      </div>
                    )}
                    {inspection.status === "In Progress" && (
                      <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 border-t md:border-t-0 md:border-l">
                        <Button>Continuar</Button>
                      </div>
                    )}
                    {inspection.status === "Completed" && (
                      <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 border-t md:border-t-0 md:border-l">
                        <Button variant="outline">Ver Relatório</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspectionTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardDescription>{template.items} itens de inspeção</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">Visualizar</Button>
                      <Button size="sm" onClick={() => handleStartInspection(template.id)}>
                        Iniciar Inspeção
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="overflow-hidden border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full py-8">
                  <div className="bg-gray-100 rounded-full p-3 mb-4">
                    <Plus className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Criar Modelo Personalizado</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    Crie um modelo de inspeção personalizado para suas necessidades específicas de projeto
                  </p>
                  <Button variant="outline">Criar Modelo</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Inspeção</CardTitle>
                <CardDescription>Gere e baixe relatórios de inspeção</CardDescription>
              </CardHeader>
              <CardContent>
                <p>O conteúdo dos relatórios será exibido aqui...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inspections;
