
import { Outlet } from "react-router-dom";
import SupabaseSiteHeader from "./SupabaseSiteHeader";

const SupabaseUserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SupabaseSiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SupabaseUserLayout;
