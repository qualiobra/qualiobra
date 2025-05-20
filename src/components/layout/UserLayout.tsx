
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import { useUserRole } from "@/context/UserRoleContext";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const UserLayout = () => {
  const { isSignedIn } = useUser();
  const { currentUserRole } = useUserRole();
  
  // Verificar se o usuário está autenticado, sem causar loop infinito
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
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
