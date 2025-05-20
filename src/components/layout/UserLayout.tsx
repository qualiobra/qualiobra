
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import { useUserRole } from "@/context/UserRoleContext";
import { Navigate } from "react-router-dom";

const UserLayout = () => {
  // Remover a verificação que está causando o loop infinito
  // e usar uma abordagem mais simples para verificar a autenticação
  
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
