
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";
import SiteHeader from "./SiteHeader";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const SupabaseUserLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar permissões para rotas administrativas
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      // Implementar verificação de permissões mais tarde
      // Por enquanto, apenas mostrar aviso
      console.log('Verificar permissões de admin para:', location.pathname);
    }
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SupabaseUserLayout;
