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
 * /historicos/{id}:
 *   get:
 *     summary: Obtener el detalle de un histórico específico por ID
 *     tags: [Históricos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalle del histórico obtenido correctamente
 *       404:
 *         description: No se encontró histórico con ese ID
 */
router.get("/:id", verificarToken, detalleHistorico);

module.exports = router;
