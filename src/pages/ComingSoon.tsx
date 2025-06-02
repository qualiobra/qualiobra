
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ClipboardCheck, BarChart3, Shield, Calendar, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email, name: name || null }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Email já cadastrado",
            description: "Este email já está na nossa lista de espera!",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Sucesso!",
          description: "Você foi adicionado à nossa lista de espera. Entraremos em contato em breve!",
        });
        setEmail("");
        setName("");
      }
    } catch (error) {
      console.error("Erro ao cadastrar email:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar seu email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
              alt="QualiObra" 
              className="h-8 w-auto" 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            Em Desenvolvimento
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            O Futuro da Gestão de
            <span className="text-primary"> Qualidade na Construção</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Estamos desenvolvendo a plataforma mais completa para controle de qualidade em obras. 
            Simplifique inspeções, gerencie equipes e gere relatórios inteligentes em um só lugar.
          </p>

          {/* Launch Date */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-700">
              Lançamento previsto: Q2 2025
            </span>
          </div>

          {/* Newsletter Signup */}
          <Card className="max-w-md mx-auto mb-16 shadow-lg">
            <CardContent className="p-6">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Seja o primeiro a saber</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Cadastre-se para receber atualizações sobre o lançamento e ter acesso exclusivo ao beta.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Seu nome (opcional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="email"
                      placeholder="Seu email profissional"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Cadastrando..." : "Quero ser notificado"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Cadastro realizado!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Você receberá atualizações em primeira mão sobre o QualiObra.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gestão de Obras</h3>
              <p className="text-gray-600 text-sm">
                Organize e acompanhe o progresso de todas as suas obras em tempo real.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Inspeções Digitais</h3>
              <p className="text-gray-600 text-sm">
                Realize inspeções de qualidade com checklists digitais e relatórios automáticos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Relatórios Inteligentes</h3>
              <p className="text-gray-600 text-sm">
                Gere relatórios detalhados e análises para tomada de decisões estratégicas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Controle de Qualidade</h3>
              <p className="text-gray-600 text-sm">
                Mantenha os padrões de qualidade com ferramentas especializadas.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-16 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Tem uma pergunta?</h3>
            <p className="text-gray-600 mb-4">
              Entre em contato conosco para mais informações sobre o QualiObra ou para discutir suas necessidades específicas.
            </p>
            <Button variant="outline" size="lg">
              Entrar em Contato
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
              alt="QualiObra" 
              className="h-6 w-auto" 
            />
          </div>
          <p className="text-gray-400">
            © 2024 QualiObra. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ComingSoon;
