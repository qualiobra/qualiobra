
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Obras from "./pages/Obras";
import Diagnostico from "./pages/Diagnostico";
import Inspections from "./pages/Inspections";
import Reports from "./pages/Reports";
import Team from "./pages/Team";
import AdminPanel from "./pages/admin/AdminPanel";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import SupabaseLogin from "./pages/auth/SupabaseLogin";
import SupabaseRegister from "./pages/auth/SupabaseRegister";
import { UserRoleProvider } from "./context/UserRoleContext";
import { SupabaseAuthProvider } from "./context/SupabaseAuthContext";
import SupabaseUserLayout from "./components/layout/SupabaseUserLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
                
                <Route path="/*" element={
                  <ProtectedRoute>
                    <SupabaseUserLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="obras" element={<Obras />} />
                  <Route path="obras/:obraId/tipologias" element={<TipologiasPage />} />
                  <Route path="obras/:obraId/tipologias/:tipologiaId/comodos" element={<ComodosPage />} />
                  <Route path="diagnostico" element={<Diagnostico />} />
                  <Route path="inspections" element={<Inspections />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="team" element={<Team />} />
                  <Route path="admin" element={<AdminPanel />} />
                  <Route path="coming-soon" element={<ComingSoon />} />
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
