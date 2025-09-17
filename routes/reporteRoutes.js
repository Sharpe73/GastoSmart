const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const db = require("../models/db");

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Rutas para obtener reportes de gastos
 */

/**
 * @swagger
 * /reportes/gastos-por-mes:
 *   get:
 *     summary: Obtiene los gastos agrupados por mes para el usuario autenticado
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gastos agrupados por mes
 */
router.get("/gastos-por-mes", verificarToken, async (req, res) => {
  try {
    const usuarioId = req.user.id; // viene del token

    const result = await db.query(
      `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', fecha), 'YYYY-MM') AS mes,
        SUM(monto)::numeric(10,2) AS total
      FROM gastos
      WHERE usuario_id = $1
      GROUP BY mes
      ORDER BY mes;
      `,
      [usuarioId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error en reporte por mes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
});

/**
 * @swagger
 * /reportes/gastos-por-dia/{anioMes}:
 *   get:
 *     summary: Obtiene los gastos agrupados por día dentro de un mes específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anioMes
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-09"
 *     responses:
 *       200:
 *         description: Lista de gastos agrupados por día en el mes
 */
router.get("/gastos-por-dia/:anioMes", verificarToken, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { anioMes } = req.params; // formato "YYYY-MM"

    const result = await db.query(
      `
      SELECT 
        EXTRACT(DAY FROM fecha)::int AS dia,
        SUM(monto)::numeric(10,2) AS total
      FROM gastos
      WHERE usuario_id = $1
        AND TO_CHAR(fecha, 'YYYY-MM') = $2
      GROUP BY dia
      ORDER BY dia;
      `,
      [usuarioId, anioMes]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error en reporte por día:", error);
    res.status(500).json({ error: "Error al obtener los reportes diarios" });
  }
});

module.exports = router;
