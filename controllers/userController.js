const pool = require("../models/db");

// 🔹 Obtener usuario por ID (sin contraseña)
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        id, 
        nombre, 
        apellido, 
        email, 
        estado,       -- 👈 nuevo campo
        creado_en, 
        ultimo_login, 
        verificado
       FROM usuarios 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    // 🔹 Formato de fechas (profesional y legible)
    const formatFecha = (fecha) => {
      if (!fecha) return null;
      const date = new Date(fecha);
      return date.toLocaleString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    usuario.creado_en = formatFecha(usuario.creado_en);
    usuario.ultimo_login = formatFecha(usuario.ultimo_login);

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
}

// 🔹 Eliminar usuario por ID
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const result = await pool.query("SELECT id FROM usuarios WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Eliminar usuario (ON DELETE CASCADE se encarga de categorías y gastos)
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);

    res.json({ mensaje: "✅ Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteUser:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
}

module.exports = { getUserById, deleteUser };
