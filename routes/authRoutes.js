const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  solicitarClaveTemporal, 
  resetPassword, 
  changePassword 
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error al registrar usuario
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       400:
 *         description: Credenciales incorrectas
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/olvidar-password:
 *   post:
 *     summary: Solicitar clave temporal para recuperar contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       200:
 *         description: Clave temporal enviada al correo
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/olvidar-password", solicitarClaveTemporal);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Cambiar la contraseña después de usar clave temporal
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               nuevaPassword:
 *                 type: string
 *                 example: NuevaClave123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Error al cambiar contraseña
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambiar la contraseña desde el perfil del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordActual:
 *                 type: string
 *                 example: ClaveVieja123
 *               nuevaPassword:
 *                 type: string
 *                 example: ClaveNueva123
 *               confirmarPassword:
 *                 type: string
 *                 example: ClaveNueva123
 *     responses:
 *       200:
 *         description: Contraseña cambiada correctamente
 *       400:
 *         description: Error en validación de contraseñas
 *       401:
 *         description: No autorizado
 */
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
