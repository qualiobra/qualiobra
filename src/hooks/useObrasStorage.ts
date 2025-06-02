
import { useState, useEffect } from "react";
import type { Obra } from "@/types/obra";
import { mockObras } from "@/data/mockObras";

export const useObrasStorage = () => {
  const [obras, setObras] = useState<Obra[]>(() => {
    const savedObras = localStorage.getItem("obras");
    return savedObras ? JSON.parse(savedObras) : mockObras;
  });

  useEffect(() => {
    localStorage.setItem("obras", JSON.stringify(obras));
  }, [obras]);

  return { obras, setObras };
};
