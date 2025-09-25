// routes/aportesRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  crearAporte,
  obtenerAportes,
  eliminarAporte,
} = require("../controllers/aportesController");

// Crear un aporte (positivo o negativo)
router.post("/", verifyToken, crearAporte);

// Obtener todos los aportes de una meta específica
router.get("/:meta_id", verifyToken, obtenerAportes);

// Eliminar un aporte por ID
router.delete("/:id", verifyToken, eliminarAporte);

module.exports = router;
