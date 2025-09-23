const pool = require("../models/db");

// 📌 Listar todos los históricos del usuario autenticado
async function listarHistoricos(req, res) {
  try {
    const usuario_id = req.user.id;

    const result = await pool.query(
      `SELECT 
         id,
         mes,
         anio,
         sueldo,
         total_gastado,
         saldo_restante,
         categorias,
         gastos,
         creado_en
       FROM historicos
       WHERE usuario_id = $1
       ORDER BY anio DESC, mes DESC`,
      [usuario_id]
    );

    res.json({
      mensaje: "📋 Lista de históricos obtenida correctamente",
      historicos: result.rows,
    });
  } catch (error) {
    console.error("❌ Error al listar históricos:", error);
    res.status(500).json({ mensaje: "Error al listar históricos" });
  }
}

// 📌 Detalle de un histórico específico (por año y mes)
async function detalleHistorico(req, res) {
  try {
    const usuario_id = req.user.id;
    const { anio, mes } = req.params;

    const result = await pool.query(
      `SELECT 
         id,
         mes,
         anio,
         sueldo,
         total_gastado,
         saldo_restante,
         categorias,
         gastos,
         creado_en
       FROM historicos
       WHERE usuario_id = $1
       AND anio = $2
       AND mes = $3
       LIMIT 1`,
      [usuario_id, anio, mes]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "❌ No se encontró histórico en ese período" });
    }

    res.json({
      mensaje: "📋 Detalle histórico obtenido correctamente",
      historico: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al obtener detalle histórico:", error);
    res.status(500).json({ mensaje: "Error al obtener detalle histórico" });
  }
}

module.exports = { listarHistoricos, detalleHistorico };
