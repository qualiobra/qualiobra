
import { useAuth } from "@/context/SupabaseAuthContext";
import { useUserRole } from "@/context/UserRoleContext";
import type { Obra } from "@/types/obra";
import { useObrasStorage } from "./useObrasStorage";
import { useObrasActions } from "./useObrasActions";

export const useObras = () => {
  const { user } = useAuth();
  const { currentUserRole } = useUserRole();
  const { obras, setObras } = useObrasStorage();
  const actions = useObrasActions(obras, setObras);

  const getObrasDoUsuario = (): Obra[] => {
    if (!user) return [];

    if (currentUserRole?.id === "admin") {
      return obras;
    }

    return obras.filter((obra) =>
      obra.usuarios.some((usuario) => usuario.email === user.email)
    );
  };
  
  // Adding alias for backward compatibility
  const adicionarObra = actions.criarObra;

  return {
    obras,
    ...actions,
    getObrasDoUsuario,
    adicionarObra, // Alias for criarObra
  };
};
