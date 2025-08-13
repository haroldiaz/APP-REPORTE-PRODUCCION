// useAlertas.js
import { useState, useCallback } from "react";
import { supabase } from "../Components/supabaseClient"; // Ajusta la ruta

export function useAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAlertas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("alertas")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error al cargar alertas:", error);
    } else {
      setAlertas(data);
    }
    setLoading(false);
  }, []);

  return { alertas, setAlertas, loading, cargarAlertas };
}
