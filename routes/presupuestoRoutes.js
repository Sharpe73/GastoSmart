const express = require("express");
const router = express.Router();
const {
  crearPresupuesto,
  obtenerPresupuesto,
  obtenerSaldo,
} = require("../controllers/presupuestoController.js"); // 👈 corregido con C mayúscula
const verifyToken = require("../middleware/authMiddleware"); // 👈 ahora usa el archivo correcto

// Crear un presupuesto
router.post("/", verifyToken, crearPresupuesto);

// Obtener presupuesto del usuario logueado
router.get("/", verifyToken, obtenerPresupuesto);

// Obtener saldo disponible (sueldo - gastos en el período)
router.get("/saldo", verifyToken, obtenerSaldo);

module.exports = router;
