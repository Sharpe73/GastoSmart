const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const {
  crearGasto,
  listarGastos,
  actualizarGasto,
  eliminarGasto,
  descargarArchivo,
} = require("../controllers/gastoController");

const multer = require("multer");
// 👉 Guardamos archivos en memoria (como buffer), no en disco
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
 *     summary: Crear un nuevo gasto para el usuario autenticado (con archivo opcional)
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: Supermercado
 *               monto:
 *                 type: number
 *                 example: 50000
 *               categoria_id:
 *                 type: integer
 *                 example: 1
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 */
router.post("/", verificarToken, upload.single("archivo"), crearGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Actualizar un gasto por ID (con archivo opcional, solo si pertenece al usuario autenticado)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               monto:
 *                 type: number
 *               categoria_id:
 *                 type: integer
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Gasto actualizado exitosamente
 *       404:
 *         description: Gasto no encontrado
 */
router.put("/:id", verificarToken, upload.single("archivo"), actualizarGasto);

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

/**
 * @swagger
 * /gastos/{id}/archivo:
 *   get:
 *     summary: Descargar archivo asociado a un gasto
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
 *         description: Devuelve el archivo PDF asociado
 *       404:
 *         description: Archivo no encontrado
 */
router.get("/:id/archivo", verificarToken, descargarArchivo);

module.exports = router;
