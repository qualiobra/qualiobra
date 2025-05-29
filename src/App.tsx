
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading, useUser } from "@clerk/clerk-react";
import { UserRoleProvider } from "./context/UserRoleContext";
import { ObrasProvider } from "./context/ObrasContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inspections from "./pages/Inspections";
import Team from "./pages/Team";
import Obras from "./pages/Obras";
import Diagnostico from "./pages/Diagnostico";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyCode from "./pages/auth/VerifyCode";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/Reports";
import UserLayout from "./components/layout/UserLayout";
import { Loader2 } from "lucide-react";
import React from "react";

// Moved queryClient outside the component
const queryClient = new QueryClient();

// Componente para rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando...</span>
        </div>
      </ClerkLoading>
      
      <ClerkLoaded>
        <SignedIn>
          {children}
        </SignedIn>
        <SignedOut>
          <Navigate to="/login" replace />
        </SignedOut>
      </ClerkLoaded>
    </>
  );
};

// Componente para rotas públicas (auth)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando...</span>
        </div>
      </ClerkLoading>
      
      <ClerkLoaded>
        <SignedIn>
          <Navigate to="/dashboard" replace />
        </SignedIn>
        <SignedOut>
          {children}
        </SignedOut>
      </ClerkLoaded>
    </>
  );
};

// Separando a estrutura da aplicação em um componente próprio
const AppRoutes = () => (
  <UserRoleProvider>
    <ObrasProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota inicial */}
            <Route path="/" element={<Index />} />
            
            {/* Rotas públicas (auth) */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/verify" element={
              <PublicRoute>
                <VerifyCode />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />
            
            {/* Rotas protegidas */}
            <Route element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/team" element={<Team />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
            
            {/* Rota de fallback para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ObrasProvider>
  </UserRoleProvider>
);

// Componente App principal com o QueryClientProvider como wrapper mais externo
const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
