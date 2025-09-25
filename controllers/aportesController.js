const pool = require("../models/db");

// 🔹 Crear un aporte (positivo o negativo)
async function crearAporte(req, res) {
  try {
    const { meta_id, monto } = req.body;
    const usuario_id = req.user.id;

    if (!meta_id || !monto) {
      return res.status(400).json({ mensaje: "Meta y monto son obligatorios" });
    }

    // Guardar aporte en la tabla
    const nuevoAporte = await pool.query(
      "INSERT INTO aportes (meta_id, monto) VALUES ($1, $2) RETURNING *",
      [meta_id, monto]
    );

    // Actualizar saldo en la meta asociada
    await pool.query(
      "UPDATE metas_ahorro SET ahorrado = GREATEST(0, ahorrado + $1) WHERE id = $2",
      [monto, meta_id]
    );

    res.json(nuevoAporte.rows[0]);
  } catch (err) {
    console.error("❌ Error en crearAporte:", err);
    res.status(500).json({ mensaje: "Error al registrar aporte" });
  }
}

// 🔹 Obtener aportes de una meta
async function obtenerAportes(req, res) {
  try {
    const { meta_id } = req.params;
    const aportes = await pool.query(
      "SELECT * FROM aportes WHERE meta_id = $1 ORDER BY fecha DESC",
      [meta_id]
    );
    res.json(aportes.rows);
  } catch (err) {
    console.error("❌ Error en obtenerAportes:", err);
    res.status(500).json({ mensaje: "Error al obtener aportes" });
  }
}

// 🔹 Eliminar un aporte
async function eliminarAporte(req, res) {
  try {
    const { id } = req.params;

    // Buscar el aporte antes de borrarlo
    const aporte = await pool.query("SELECT * FROM aportes WHERE id = $1", [id]);

    if (aporte.rows.length === 0) {
      return res.status(404).json({ mensaje: "Aporte no encontrado" });
    }

    const { meta_id, monto } = aporte.rows[0];

    // Revertir el efecto en la meta
    await pool.query(
      "UPDATE metas_ahorro SET ahorrado = GREATEST(0, ahorrado - $1) WHERE id = $2",
      [monto, meta_id]
    );

    // Eliminar el aporte
    await pool.query("DELETE FROM aportes WHERE id = $1", [id]);

    res.json({ mensaje: "Aporte eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en eliminarAporte:", err);
    res.status(500).json({ mensaje: "Error al eliminar aporte" });
  }
}

module.exports = { crearAporte, obtenerAportes, eliminarAporte };
