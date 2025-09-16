const pool = require("../models/db");

// 🔹 Obtener todas las categorías de un usuario
async function getCategorias(req, res) {
  try {
    const usuarioId = req.user.id; // viene del token
    const result = await pool.query(
      "SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY id DESC",
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ mensaje: "Error al obtener categorías" });
  }
}

// 🔹 Crear nueva categoría
async function createCategoria(req, res) {
  try {
    const usuarioId = req.user.id;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: "El nombre es obligatorio" });
    }

    const result = await pool.query(
      "INSERT INTO categorias (nombre, usuario_id) VALUES ($1, $2) RETURNING *",
      [nombre, usuarioId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ mensaje: "Error al crear categoría" });
  }
}

// 🔹 Editar categoría
async function updateCategoria(req, res) {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;
    const { nombre } = req.body;

    const result = await pool.query(
      "UPDATE categorias SET nombre = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *",
      [nombre, id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ mensaje: "Error al actualizar categoría" });
  }
}

// 🔹 Eliminar categoría
async function deleteCategoria(req, res) {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM categorias WHERE id = $1 AND usuario_id = $2 RETURNING *",
      [id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ mensaje: "Error al eliminar categoría" });
  }
}

module.exports = {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
