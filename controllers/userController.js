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
        estado,
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

    // 🔹 Formato de fechas
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

// 🔹 Actualizar usuario (solo nombre y apellido)
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellido } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ mensaje: "Nombre y apellido son obligatorios" });
    }

    // Verificar si el usuario existe
    const result = await pool.query("SELECT id FROM usuarios WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualizar solo nombre y apellido
    const actualizado = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, apellido = $2
       WHERE id = $3
       RETURNING id, nombre, apellido, email, estado, creado_en, ultimo_login, verificado`,
      [nombre, apellido, id]
    );

    res.json({
      mensaje: "✅ Usuario actualizado correctamente",
      usuario: actualizado.rows[0],
    });
  } catch (error) {
    console.error("❌ Error en updateUser:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
}

// 🔹 Eliminar usuario por ID
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const result = await pool.query("SELECT id FROM usuarios WHERE id = $1", [id]);

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

module.exports = { getUserById, updateUser, deleteUser };
