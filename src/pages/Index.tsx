
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Gauge, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const handleDemoClick = () => {
    toast({
      title: "Demo Iniciada",
      description: "Bem-vindo ao QualiObra! Explore as funcionalidades da nossa plataforma.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
              alt="QualiObra Logo" 
              className="h-12 w-auto mr-3" 
            />
            <h1 className="text-2xl font-bold text-gray-900">QualiObra</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Início</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
            <Link to="/inspections" className="text-gray-700 hover:text-primary font-medium">Inspeções</Link>
            <Link to="/team" className="text-gray-700 hover:text-primary font-medium">Equipe</Link>
          </nav>
          <Button onClick={handleDemoClick}>Experimente Demo</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Simplifique a Gestão de Qualidade na Construção
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              O QualiObra ajuda equipes de construção a automatizar inspeções, monitorar conformidade
              e engajar membros da equipe enquanto atende aos padrões ISO e PBQP-H.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-medium">
                Começar Agora <ArrowRight className="ml-2" size={18} />
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="font-medium">
                  Ver Dashboard Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" 
              alt="Canteiro de obras" 
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Principais Recursos</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ClipboardCheck size={24} />}
              title="Inspeções Padronizadas"
              description="Checklists pré-fabricados e personalizáveis que garantem inspeções de qualidade consistentes em todos os canteiros de obra."
            />
            <FeatureCard 
              icon={<Gauge size={24} />}
              title="Dashboards em Tempo Real"
              description="Métricas interativas para conformidade, não-conformidades e produtividade com opções detalhadas de filtragem."
            />
            <FeatureCard 
              icon={<Users size={24} />}
              title="Engajamento da Equipe"
              description="Gamificação com pontos, rankings e recompensas para impulsionar a participação e melhorias."
            />
            <FeatureCard 
              icon={<MessageSquare size={24} />}
              title="Notificações por WhatsApp"
              description="Alertas automáticos e lembretes para tarefas pendentes ou novas inspeções via WhatsApp."
            />
            <FeatureCard 
              icon={<MessageSquare size={24} />}
              title="Assistente de IA"
              description="Obtenha respostas sobre normas e gere relatórios automatizados com nosso chatbot de IA."
            />
            <FeatureCard 
              icon={<ClipboardCheck size={24} />}
              title="Registros Completos"
              description="Banco de dados centralizado com histórico completo de inspeções e evidências, incluindo fotos e anotações."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary/10 rounded-xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Pronto para melhorar a gestão de qualidade?</h3>
            <p className="text-lg mb-8">
              Junte-se a outras construtoras que já usam o QualiObra para melhorar a conformidade,
              o engajamento da equipe e os resultados dos projetos.
            </p>
            <Button size="lg" className="font-medium">
              Inicie seu Período de Teste Gratuito
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
                  alt="QualiObra Logo" 
                  className="h-10 w-auto bg-white rounded-full p-1 mr-3" 
                />
                <h2 className="text-xl font-bold">QualiObra</h2>
              </div>
              <p className="mt-4 max-w-md text-gray-400">
                Plataforma de gestão de qualidade para conformidade com ISO e PBQP-H na construção civil.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Produto</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Recursos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Preços</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Estudos de Caso</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Recursos</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Documentação</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Guias</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Suporte</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Empresa</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Sobre</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} QualiObra. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
      <div className="text-primary">{icon}</div>
    </div>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
