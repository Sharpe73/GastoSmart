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

module.exports = router;
