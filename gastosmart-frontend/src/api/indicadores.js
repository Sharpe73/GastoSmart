import axios from "axios";

// Base de la API de mindicador.cl
const INDICADORES_API = "https://mindicador.cl/api";

// Función para obtener indicadores principales
export const obtenerIndicadores = async () => {
  try {
    const res = await axios.get(INDICADORES_API);
    return {
      uf: res.data.uf.valor,
      dolar: res.data.dolar.valor,
      ipc: res.data.ipc.valor,
      utm: res.data.utm.valor,
      fecha: res.data.fecha,
    };
  } catch (error) {
    console.error("❌ Error al obtener indicadores:", error);
    return null;
  }
};
