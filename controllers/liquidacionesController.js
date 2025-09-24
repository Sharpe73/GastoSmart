// controllers/liquidacionesController.js
const pool = require("../models/db");

// 📌 Subir liquidación (se guarda en la BD como BYTEA)
const subirLiquidacion = async (req, res) => {
  try {
    const usuario_id = req.user.id; // 👈 viene del token
    const { mes, anio } = req.body;

    if (!req.file) {
      return res.status(400).json({ mensaje: "⚠️ Debes adjuntar un archivo PDF." });
    }

    // Guardamos el archivo como binario en PostgreSQL
    const archivoBuffer = req.file.buffer;

    const result = await pool.query(
      `INSERT INTO liquidaciones (usuario_id, mes, anio, archivo, creado_en)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, mes, anio, creado_en`,
      [usuario_id, mes, anio, archivoBuffer]
    );

    res.status(201).json({
      mensaje: "✅ Liquidación subida correctamente",
      liquidacion: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al subir liquidación:", error);
    res.status(500).json({ mensaje: "Error al subir liquidación" });
  }
};

// 📌 Listar liquidaciones del usuario (solo metadatos, no el PDF)
const listarLiquidaciones = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const result = await pool.query(
      `SELECT id, mes, anio, creado_en
       FROM liquidaciones
       WHERE usuario_id = $1
       ORDER BY anio DESC, mes DESC`,
      [usuario_id]
    );

    res.json({
      mensaje: "📋 Lista de liquidaciones obtenida correctamente",
      liquidaciones: result.rows,
    });
  } catch (error) {
    console.error("❌ Error al listar liquidaciones:", error);
    res.status(500).json({ mensaje: "Error al listar liquidaciones" });
  }
};

// 📌 Descargar liquidación (PDF desde la BD)
const descargarLiquidacion = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT archivo FROM liquidaciones WHERE id = $1 AND usuario_id = $2`,
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "❌ Liquidación no encontrada" });
    }

    const archivoBuffer = result.rows[0].archivo;

    if (!archivoBuffer) {
      return res.status(404).json({ mensaje: "❌ El archivo no está almacenado" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="liquidacion-${id}.pdf"`);
    res.send(archivoBuffer);
  } catch (error) {
    console.error("❌ Error al descargar liquidación:", error);
    res.status(500).json({ mensaje: "Error al descargar liquidación" });
  }
};

module.exports = {
  subirLiquidacion,
  listarLiquidaciones,
  descargarLiquidacion,
};
