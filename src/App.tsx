
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider } from "./context/SupabaseAuthContext";
import { ObrasProvider } from "./context/ObrasContext";
import { UserRoleProvider } from "./context/UserRoleContext";
import ComingSoon from "./pages/ComingSoon";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Inspections from "./pages/Inspections";
import Team from "./pages/Team";
import Obras from "./pages/Obras";
import TipologiasPage from "./pages/TipologiasPage";
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
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);
  
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
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <SupabaseUserLayout>{children}</SupabaseUserLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('PublicRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);
  
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
    console.log('User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/preview" element={<ComingSoon />} />
        
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
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/inspections" element={
          <ProtectedRoute>
            <Inspections />
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        } />
        <Route path="/obras" element={
          <ProtectedRoute>
            <Obras />
          </ProtectedRoute>
        } />
        <Route path="/obras/:obraId/tipologias" element={
          <ProtectedRoute>
            <TipologiasPage />
          </ProtectedRoute>
        } />
        <Route path="/diagnostico" element={
          <ProtectedRoute>
            <Diagnostico />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin/user-management" element={
          <ProtectedRoute>
            <SupabaseUserManagement />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <UserRoleProvider>
        <ObrasProvider>
          <AppContent />
        </ObrasProvider>
      </UserRoleProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
