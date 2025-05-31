
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider } from "./context/SupabaseAuthContext";
import { ObrasProvider } from "./context/ObrasContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inspections from "./pages/Inspections";
import Team from "./pages/Team";
import Obras from "./pages/Obras";
import Diagnostico from "./pages/Diagnostico";
import NotFound from "./pages/NotFound";
import SupabaseLogin from "./pages/auth/SupabaseLogin";
import SupabaseRegister from "./pages/auth/SupabaseRegister";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import SupabaseUserManagement from "./pages/admin/SupabaseUserManagement";
import Reports from "./pages/Reports";
import SupabaseUserLayout from "./components/layout/SupabaseUserLayout";
import React from "react";

// Moved queryClient outside the component
const queryClient = new QueryClient();

// Componente para rota protegida com Supabase
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return children;
};

// Componente para rotas públicas (auth)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return children;
};

// Separando a estrutura da aplicação em um componente próprio
const AppRoutes = () => (
  <SupabaseAuthProvider>
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
                <SupabaseLogin />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <SupabaseRegister />
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
                <SupabaseUserLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/team" element={<Team />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/users" element={<SupabaseUserManagement />} />
            </Route>
            
            {/* Rota de fallback para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ObrasProvider>
  </SupabaseAuthProvider>
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
