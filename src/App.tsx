
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useAuth } from "./context/SupabaseAuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
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
  
  if (!isAuthenticated) {
    return <SupabaseLogin />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
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
  
  if (isAuthenticated) {
    return <Dashboard />;
  }
  
  return <>{children}</>;
};

const AppContent = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        
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
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <ObrasProvider>
        <AppContent />
      </ObrasProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
