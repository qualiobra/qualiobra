
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ClipboardCheck, BarChart3, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
              alt="QualiObra" 
              className="h-8 w-auto" 
            />
            <span className="font-bold text-xl text-gray-900">QualiObra</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Cadastrar-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestão de Qualidade em 
            <span className="text-primary"> Construção Civil</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Simplifique o controle de qualidade das suas obras com nossa plataforma completa. 
            Gerencie inspeções, equipes e relatórios em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register">
              <Button size="lg" className="px-8 py-3 text-lg">
                Comece Gratuitamente
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestão de Obras</h3>
            <p className="text-gray-600">
              Organize e acompanhe o progresso de todas as suas obras em tempo real.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Inspeções Digitais</h3>
            <p className="text-gray-600">
              Realize inspeções de qualidade com checklists digitais e relatórios automáticos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Relatórios Inteligentes</h3>
            <p className="text-gray-600">
              Gere relatórios detalhados e análises para tomada de decisões estratégicas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Controle de Qualidade</h3>
            <p className="text-gray-600">
              Mantenha os padrões de qualidade com ferramentas especializadas.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para transformar a gestão das suas obras?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Junte-se a centenas de empresas que já confiam no QualiObra para garantir a qualidade de seus projetos.
          </p>
          <Link to="/register">
            <Button size="lg" className="px-8 py-3 text-lg">
              Comece Agora - É Gratuito
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
              alt="QualiObra" 
              className="h-6 w-auto" 
            />
            <span className="font-bold text-lg">QualiObra</span>
          </div>
          <p className="text-gray-400">
            © 2024 QualiObra. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
