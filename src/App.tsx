
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
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

// App component wraps everything with QueryClientProvider
const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
            <Route path="/verify" element={
              <SignedOut>
                <VerifyCode />
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
                <UserRoleProvider>
                  <ObrasProvider>
                    <UserLayout />
                  </ObrasProvider>
                </UserRoleProvider>
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
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
