const pool = require("../models/db");

// Crear un gasto
async function crearGasto(req, res) {
  try {
    const { usuario_id, descripcion, monto, fecha, categoria } = req.body;

    if (!usuario_id || !descripcion || !monto || !fecha) {
      return res.status(400).json({ mensaje: "Todos los campos obligatorios deben ser enviados" });
    }

    const nuevoGasto = await pool.query(
      `INSERT INTO gastos (usuario_id, descripcion, monto, fecha, categoria)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [usuario_id, descripcion, monto, fecha, categoria || null]
    );

    res.status(201).json({
      mensaje: "✅ Gasto creado exitosamente",
      gasto: nuevoGasto.rows[0],
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
      return res.status(400).json({ mensaje: "El usuario_id es obligatorio" });
    }

    const gastos = await pool.query(
      "SELECT * FROM gastos WHERE usuario_id = $1 ORDER BY fecha DESC",
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
    const { descripcion, monto, fecha, categoria } = req.body;

    const gasto = await pool.query("SELECT * FROM gastos WHERE id = $1", [id]);
    if (gasto.rows.length === 0) {
      return res.status(404).json({ mensaje: "Gasto no encontrado" });
    }

    const actualizado = await pool.query(
      `UPDATE gastos 
       SET descripcion = $1, monto = $2, fecha = $3, categoria = $4
       WHERE id = $5 RETURNING *`,
      [descripcion, monto, fecha, categoria, id]
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

    res.json({ mensaje: "🗑️ Gasto eliminado correctamente" });
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
