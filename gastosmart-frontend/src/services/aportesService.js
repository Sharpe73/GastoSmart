// src/services/aportesService.js
import API from "../api";

export const obtenerAportesPorMeta = async (metaId, token) => {
  try {
    const res = await API.get(`/aportes/${metaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener aportes:", error);
    return [];
  }
};

export const registrarAporte = async (metaId, monto, token) => {
  try {
    const res = await API.post(
      "/aportes",
      { meta_id: metaId, monto },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error al registrar aporte:", error);
    throw error;
  }
};

export const eliminarAporte = async (aporteId, token) => {
  try {
    await API.delete(`/aportes/${aporteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar aporte:", error);
    return false;
  }
};
