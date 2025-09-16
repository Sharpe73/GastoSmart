// src/services/categoriaService.js
import API from "../api";

// Obtener todas las categorías del usuario autenticado
export const getCategorias = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/categorias", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Crear nueva categoría
export const createCategoria = async (nombre) => {
  const token = localStorage.getItem("token");
  const res = await API.post(
    "/categorias",
    { nombre },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Actualizar categoría
export const updateCategoria = async (id, nombre) => {
  const token = localStorage.getItem("token");
  const res = await API.put(
    `/categorias/${id}`,
    { nombre },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Eliminar categoría
export const deleteCategoria = async (id) => {
  const token = localStorage.getItem("token");
  const res = await API.delete(`/categorias/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
