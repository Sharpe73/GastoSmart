// src/api/combustible.js
import axios from "axios";

// Endpoint oficial de la SEC (Bencina en Línea)
const BASE_URL = "https://api.bencinaenlinea.cl/v1/estaciones";

// 🔹 Obtener estaciones de servicio cercanas según ubicación y combustible
export const obtenerCombustibles = async (lat, lng, radio = 5000) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitud: lat,
        longitud: lng,
        radio, // en metros
      },
    });

    // Retornar solo lo necesario (nombre, dirección y precios)
    return response.data.map((estacion) => ({
      nombre: estacion.nombre,
      direccion: estacion.direccion,
      precios: estacion.combustibles.map((c) => ({
        tipo: c.tipo, // Ej: Gasolina 93, 95, 97, Diesel
        precio: c.precio,
      })),
    }));
  } catch (error) {
    console.error("❌ Error al obtener precios de combustible:", error);
    return [];
  }
};
