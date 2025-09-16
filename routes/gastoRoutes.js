const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const {
  crearGasto,
  listarGastos,
  actualizarGasto,
  eliminarGasto,
} = require("../controllers/gastoController");

/**
 * @swagger
 * tags:
 *   name: Gastos
 *   description: Rutas para gestionar gastos (requieren autenticación)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /gastos:
 *   get:
 *     summary: Listar todos los gastos del usuario autenticado
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gastos del usuario
 */
router.get("/", verificarToken, listarGastos);

/**
 * @swagger
 * /gastos:
 *   post:
 *     summary: Crear un nuevo gasto para el usuario autenticado
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: Supermercado
 *               monto:
 *                 type: number
 *                 example: 50000
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-16
 *               categoria:
 *                 type: string
 *                 example: Alimentación
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 */
router.post("/", verificarToken, crearGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Actualizar un gasto por ID (solo si pertenece al usuario autenticado)
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               monto:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gasto actualizado exitosamente
 *       404:
 *         description: Gasto no encontrado
 */
router.put("/:id", verificarToken, actualizarGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   delete:
 *     summary: Eliminar un gasto por ID (solo si pertenece al usuario autenticado)
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gasto eliminado exitosamente
 *       404:
 *         description: Gasto no encontrado
 */
router.delete("/:id", verificarToken, eliminarGasto);

module.exports = router;
