const pool = require("../models/db");

// Función segura para parsear JSON
function safeParseJSON(value) {
  if (!value) return [];
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("⚠️ Error al parsear JSON:", e.message);
      return [];
    }
  }
  return value; // ya es objeto
}

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

    const historicos = result.rows.map((h) => ({
      ...h,
      categorias: safeParseJSON(h.categorias),
      gastos: safeParseJSON(h.gastos),
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

    const historico = result.rows[0];
    historico.categorias = safeParseJSON(historico.categorias);
    historico.gastos = safeParseJSON(historico.gastos);

    res.json(historico);
  } catch (error) {
    console.error("❌ Error al obtener detalle histórico:", error);
    res.status(500).json({ mensaje: "Error al obtener detalle histórico" });
  }
}

module.exports = { listarHistoricos, detalleHistorico };
