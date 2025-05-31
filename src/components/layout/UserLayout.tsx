
import { ReactNode } from "react";
import SupabaseSiteHeader from "./SupabaseSiteHeader";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SupabaseSiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
