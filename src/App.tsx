
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import { UserRoleProvider } from "./context/UserRoleContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inspections from "./pages/Inspections";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminPanel from "./pages/admin/AdminPanel";
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

// Separando a estrutura da aplicação em um componente próprio
const AppRoutes = () => (
  <UserRoleProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={
            <SignedOut>
              <Login />
            </SignedOut>
          } />
          <Route path="/register" element={
            <SignedOut>
              <Register />
            </SignedOut>
          } />
          <Route path="/forgot-password" element={
            <SignedOut>
              <ForgotPassword />
            </SignedOut>
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
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          {/* Rota de fallback para página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
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
