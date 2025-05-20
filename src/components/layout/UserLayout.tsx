
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import { useUserRole } from "@/context/UserRoleContext";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const UserLayout = () => {
  const { isSignedIn } = useUser();
  const { currentUserRole } = useUserRole();
  const location = useLocation();
  
  // Verificar se o usuário está autenticado
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar permissões para rotas administrativas
  useEffect(() => {
    // Verificar se a rota atual é uma rota administrativa
    if (location.pathname.startsWith('/admin')) {
      // Se o usuário não tem permissão de administrador
      if (currentUserRole && !currentUserRole.permissions.includes('all')) {
        toast({
          title: "Acesso Restrito",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
      }
    }
  }, [location.pathname, currentUserRole]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
