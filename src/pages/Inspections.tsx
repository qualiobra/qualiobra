
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
  { id: 1, name: "Structural Inspection", category: "Structural", items: 24 },
  { id: 2, name: "Electrical Systems", category: "Electrical", items: 18 },
  { id: 3, name: "Plumbing Installation", category: "Plumbing", items: 15 },
  { id: 4, name: "Finishing Works", category: "Finishing", items: 22 },
  { id: 5, name: "Foundation Inspection", category: "Structural", items: 20 },
  { id: 6, name: "Fire Safety Compliance", category: "Safety", items: 16 },
];

const sampleInspections = [
  { 
    id: 1, 
    title: "Foundation Inspection", 
    site: "Residential Tower A", 
    date: "2023-05-19", 
    status: "Completed", 
    compliance: 92,
    inspector: "João Silva" 
  },
  { 
    id: 2, 
    title: "Electrical Systems", 
    site: "Office Building B", 
    date: "2023-05-18", 
    status: "In Progress", 
    compliance: 78,
    inspector: "Maria Oliveira" 
  },
  { 
    id: 3, 
    title: "Plumbing Installation", 
    site: "Residential Tower A", 
    date: "2023-05-17", 
    status: "Draft", 
    compliance: 0,
    inspector: "Carlos Santos" 
  },
  { 
    id: 4, 
    title: "Structural Framing", 
    site: "Shopping Center C", 
    date: "2023-05-16", 
    status: "Completed", 
    compliance: 86,
    inspector: "Ana Pereira" 
  },
  { 
    id: 5, 
    title: "Finishing Works", 
    site: "Hotel Project D", 
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
      title: "Inspection Created",
      description: `New inspection "${data.title}" has been created`,
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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case "Draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspections</h1>
            <p className="text-gray-600">Manage and create quality inspections for all your projects</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Inspection</DialogTitle>
                <DialogDescription>
                  Fill out the details to start a new quality inspection
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspection Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter inspection title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="site"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Construction Site</FormLabel>
                        <FormControl>
                          <Input placeholder="Select construction site" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <FormControl>
                          <Input placeholder="Select inspection template" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Inspector</FormLabel>
                        <FormControl>
                          <Input placeholder="Select inspector" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="submit">Create Inspection</Button>
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
              <ClipboardCheck className="mr-2 h-4 w-4" /> Inspections
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" /> Templates
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="mr-2 h-4 w-4" /> Reports
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 my-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search inspections..." className="pl-9" />
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Download Report</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Date: {new Date(inspection.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>Inspector: {inspection.inspector}</span>
                        </div>
                        {inspection.status === "Completed" && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">Compliance:</span>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {inspection.compliance}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {inspection.status === "Draft" && (
                      <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 border-t md:border-t-0 md:border-l">
                        <Button>Continue</Button>
                      </div>
                    )}
                    {inspection.status === "In Progress" && (
                      <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 border-t md:border-t-0 md:border-l">
                        <Button>Continue</Button>
                      </div>
                    )}
                    {inspection.status === "Completed" && (
                      <div className="md:w-48 flex items-center justify-center p-6 bg-gray-50 border-t md:border-t-0 md:border-l">
                        <Button variant="outline">View Report</Button>
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
                    <CardDescription>{template.items} inspection items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button size="sm" onClick={() => handleStartInspection(template.id)}>
                        Start Inspection
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
                  <h3 className="font-medium text-lg mb-2">Create Custom Template</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    Design a custom inspection template for your specific project needs
                  </p>
                  <Button variant="outline">Create Template</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Reports</CardTitle>
                <CardDescription>Generate and download inspection reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reports content will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inspections;
