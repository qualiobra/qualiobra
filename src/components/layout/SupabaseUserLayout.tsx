
import { ReactNode } from "react";
import SupabaseSiteHeader from "./SupabaseSiteHeader";

interface SupabaseUserLayoutProps {
  children: ReactNode;
}

const SupabaseUserLayout = ({ children }: SupabaseUserLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SupabaseSiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default SupabaseUserLayout;
