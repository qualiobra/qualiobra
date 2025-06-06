import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import {
  SupabaseAuthProvider,
  SupabaseLogin,
  SupabaseRegister,
  SupabaseUserLayout,
  SupabaseUserManagement,
  ForgotPassword,
  ResetPassword,
  VerifyCode,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-react";
import {
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Obras from "./pages/Obras";
import Diagnostico from "./pages/Diagnostico";
import Inspections from "./pages/Inspections";
import Reports from "./pages/Reports";
import Team from "./pages/Team";
import AdminPanel from "./pages/AdminPanel";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import { UserRoleProvider } from "./context/UserRoleContext";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import TipologiasPage from "./pages/TipologiasPage";
import ComodosPage from "./pages/ComodosPage";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <UserRoleProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<SupabaseLogin />} />
                <Route path="/register" element={<SupabaseRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-code" element={<VerifyCode />} />
                
                <Route element={<SupabaseUserLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/obras" element={<Obras />} />
                  <Route path="/obras/:obraId/tipologias" element={<TipologiasPage />} />
                  <Route path="/obras/:obraId/tipologias/:tipologiaId/comodos" element={<ComodosPage />} />
                  <Route path="/diagnostico" element={<Diagnostico />} />
                  <Route path="/inspections" element={<Inspections />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/users" element={<SupabaseUserManagement />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </UserRoleProvider>
      </SupabaseAuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
