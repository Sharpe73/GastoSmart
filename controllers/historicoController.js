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

    // 🔹 Parsear categorías y gastos en cada histórico
    const historicos = result.rows.map((h) => ({
      ...h,
      categorias: JSON.parse(h.categorias || "[]"),
      gastos: JSON.parse(h.gastos || "[]"),
    }));

    res.json({
      mensaje: "📋 Lista de históricos obtenida correctamente",
      historicos,
    });
  } catch (error) {
    console.error("❌ Error al listar históricos:", error);
    res.status(500).json({ mensaje: "Error al listar históricos" });
  }
}

// 📌 Detalle de un histórico específico (por ID)
async function detalleHistorico(req, res) {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;

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
       AND id = $2
       LIMIT 1`,
      [usuario_id, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "❌ No se encontró el histórico solicitado" });
    }

    // 🔹 Parsear los campos JSON
    const historico = result.rows[0];
    historico.categorias = JSON.parse(historico.categorias || "[]");
    historico.gastos = JSON.parse(historico.gastos || "[]");

    res.json(historico);
  } catch (error) {
    console.error("❌ Error al obtener detalle histórico:", error);
    res.status(500).json({ mensaje: "Error al obtener detalle histórico" });
  }
}

module.exports = { listarHistoricos, detalleHistorico };
