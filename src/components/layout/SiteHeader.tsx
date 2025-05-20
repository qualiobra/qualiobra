
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, User, Bell, Settings } from "lucide-react";

const SiteHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
                alt="QualiObra Logo" 
                className="h-10 w-auto mr-2" 
              />
              <span className="font-bold text-xl">QualiObra</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
            <Link to="/inspections" className="text-gray-700 hover:text-primary font-medium">Inspeções</Link>
            <Link to="/team" className="text-gray-700 hover:text-primary font-medium">Equipe</Link>
            <Link to="/reports" className="text-gray-700 hover:text-primary font-medium">Relatórios</Link>
          </nav>
          
          {/* User & Notification Dropdowns */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <NotificationItem 
                    title="Nova não-conformidade" 
                    description="Problema crítico reportado no Site A - Inspeção de Fundação"
                    time="2 horas atrás"
                    isNew={true}
                  />
                  <NotificationItem 
                    title="Inspeção concluída" 
                    description="Marcos Silva concluiu a inspeção estrutural"
                    time="Ontem"
                    isNew={false}
                  />
                  <NotificationItem 
                    title="Tarefa atribuída" 
                    description="Você foi designado para revisar a inspeção elétrica"
                    time="2 dias atrás"
                    isNew={false}
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-center">
                  <Link to="/notifications" className="w-full text-primary">Ver todas notificações</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                  <User size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-100 rounded-md">Dashboard</Link>
              <Link to="/inspections" className="px-4 py-2 hover:bg-gray-100 rounded-md">Inspeções</Link>
              <Link to="/team" className="px-4 py-2 hover:bg-gray-100 rounded-md">Equipe</Link>
              <Link to="/reports" className="px-4 py-2 hover:bg-gray-100 rounded-md">Relatórios</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Notification Item Component
const NotificationItem = ({ 
  title, 
  description, 
  time, 
  isNew 
}: { 
  title: string; 
  description: string; 
  time: string; 
  isNew: boolean;
}) => (
  <div className={`p-4 hover:bg-gray-50 cursor-pointer ${isNew ? 'bg-blue-50/50' : ''}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {isNew && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
    </div>
    <p className="text-xs text-gray-400 mt-2">{time}</p>
  </div>
);

export default SiteHeader;
