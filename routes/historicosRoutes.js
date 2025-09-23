const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const {
  listarHistoricos,
  detalleHistorico,
} = require("../controllers/historicoController");

/**
 * @swagger
 * tags:
 *   name: Históricos
 *   description: Rutas para consultar presupuestos y gastos de meses anteriores
 */

/**
 * @swagger
 * /historicos:
 *   get:
 *     summary: Listar todos los históricos del usuario autenticado
 *     tags: [Históricos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de históricos obtenida correctamente
 */
router.get("/", verificarToken, listarHistoricos);

/**
 * @swagger
 * /historicos/{anio}/{mes}:
 *   get:
 *     summary: Obtener el detalle de un histórico específico (año y mes)
 *     tags: [Históricos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anio
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2025
 *       - in: path
 *         name: mes
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Detalle del histórico obtenido correctamente
 *       404:
 *         description: No se encontró histórico en ese período
 */
router.get("/:anio/:mes", verificarToken, detalleHistorico);

module.exports = router;
