// controllers/userController.js
const pool = require("../models/db");

// 🔹 Obtener usuario por ID (sin contraseña)
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, nombre, apellido, email, creado_en FROM usuarios WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
}

module.exports = { getUserById };
