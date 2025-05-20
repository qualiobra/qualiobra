
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useUserRole } from "@/context/UserRoleContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { BarChart3, ClipboardList, Layers, UserCircle2, Settings } from "lucide-react";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <BarChart3 className="w-4 h-4 mr-2" />,
  },
  {
    title: "Inspeções",
    href: "/inspections",
    icon: <ClipboardList className="w-4 h-4 mr-2" />,
  },
  {
    title: "Obras",
    href: "/obras",
    icon: <Layers className="w-4 h-4 mr-2" />,
  },
  {
    title: "Equipe",
    href: "/team",
    icon: <UserCircle2 className="w-4 h-4 mr-2" />,
  },
];

function SiteHeader() {
  const { signOut } = useClerk();
  const { pathname } = useLocation();
  const { currentUserRole } = useUserRole();

  const isAdmin = currentUserRole?.permissions.includes("all");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2 font-bold">
          <span className="text-xl font-semibold text-primary hidden sm:inline-block">QualiObra</span>
        </Link>
        <NavigationMenu className="mx-6">
          <NavigationMenuList>
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link to={item.href}>
                  <NavigationMenuLink 
                    className={cn(navigationMenuTriggerStyle(), 
                      pathname === item.href && "bg-accent text-accent-foreground",
                      "flex items-center"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            
            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Administração
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-2">
                    <li>
                      <Link to="/admin">
                        <NavigationMenuLink className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === "/admin" && "bg-accent text-accent-foreground"
                        )}>
                          <div className="text-sm font-medium leading-none">Painel Admin</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/users">
                        <NavigationMenuLink className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === "/admin/users" && "bg-accent text-accent-foreground"
                        )}>
                          <div className="text-sm font-medium leading-none">Gestão de Usuários</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
