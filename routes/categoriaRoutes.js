const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} = require("../controllers/categoriaController");

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Rutas para gestionar categorías (requieren autenticación)
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtener todas las categorías del usuario autenticado
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", verificarToken, getCategorias);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Alimentación
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 */
router.post("/", verificarToken, createCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
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
 *               nombre:
 *                 type: string
 *                 example: Transporte
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/:id", verificarToken, updateCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
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
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", verificarToken, deleteCategoria);

module.exports = router;
