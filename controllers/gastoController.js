const pool = require("../models/db");

// Crear un gasto
async function crearGasto(req, res) {
  try {
    const { usuario_id, descripcion, monto, fecha, categoria_id } = req.body;

    if (!usuario_id || !descripcion || !monto) {
      return res
        .status(400)
        .json({ mensaje: "usuario_id, descripción y monto son obligatorios" });
    }

    const nuevoGasto = await pool.query(
      `INSERT INTO gastos (usuario_id, descripcion, monto, fecha, categoria_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [usuario_id, descripcion, monto, fecha || new Date(), categoria_id || null]
    );

    // 🔹 Traer también el nombre de la categoría
    const gastoConCategoria = await pool.query(
      `SELECT g.*, c.nombre AS categoria_nombre
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.id = $1`,
      [nuevoGasto.rows[0].id]
    );

    res.status(201).json({
      mensaje: "✅ Gasto creado exitosamente",
      gasto: gastoConCategoria.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al crear gasto:", error);
    res.status(500).json({ mensaje: "Error al crear gasto" });
  }
}

// Listar todos los gastos de un usuario
async function listarGastos(req, res) {
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res
        .status(400)
        .json({ mensaje: "El usuario_id es obligatorio" });
    }

    const gastos = await pool.query(
      `SELECT g.*, c.nombre AS categoria_nombre
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.usuario_id = $1
       ORDER BY g.fecha DESC`,
      [usuario_id]
    );

    res.json({
      mensaje: "📋 Lista de gastos obtenida correctamente",
      total: gastos.rows.length,
      gastos: gastos.rows,
    });
  } catch (error) {
    console.error("❌ Error al listar gastos:", error);
    res.status(500).json({ mensaje: "Error al listar gastos" });
  }
}

// Actualizar un gasto
async function actualizarGasto(req, res) {
  try {
    const { id } = req.params;
    const { descripcion, monto, fecha, categoria_id } = req.body;

    const gasto = await pool.query("SELECT * FROM gastos WHERE id = $1", [id]);
    if (gasto.rows.length === 0) {
      return res.status(404).json({ mensaje: "Gasto no encontrado" });
    }

    await pool.query(
      `UPDATE gastos 
       SET descripcion = $1, monto = $2, fecha = $3, categoria_id = $4
       WHERE id = $5`,
      [descripcion, monto, fecha || new Date(), categoria_id || null, id]
    );

    // 🔹 Devolver actualizado con nombre de categoría
    const actualizado = await pool.query(
      `SELECT g.*, c.nombre AS categoria_nombre
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.id = $1`,
      [id]
    );

    res.json({
      mensaje: "✅ Gasto actualizado correctamente",
      gasto: actualizado.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al actualizar gasto:", error);
    res.status(500).json({ mensaje: "Error al actualizar gasto" });
  }
}

// Eliminar un gasto
async function eliminarGasto(req, res) {
  try {
    const { id } = req.params;

    const gasto = await pool.query("SELECT * FROM gastos WHERE id = $1", [id]);
    if (gasto.rows.length === 0) {
      return res.status(404).json({ mensaje: "Gasto no encontrado" });
    }

    await pool.query("DELETE FROM gastos WHERE id = $1", [id]);

    res.json({ mensaje: "🗑️ Gasto eliminado correctamente", id });
  } catch (error) {
    console.error("❌ Error al eliminar gasto:", error);
    res.status(500).json({ mensaje: "Error al eliminar gasto" });
  }
}

module.exports = {
  crearGasto,
  listarGastos,
  actualizarGasto,
  eliminarGasto,
};
