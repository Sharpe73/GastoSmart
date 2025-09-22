const express = require("express");
const router = express.Router();
const { crearPresupuesto, obtenerPresupuesto, obtenerSaldo } = require("../controllers/presupuestoController");
const verifyToken = require("../middleware/verifyToken");

// Crear un presupuesto
router.post("/", verifyToken, crearPresupuesto);

// Obtener presupuesto del usuario logueado
router.get("/", verifyToken, obtenerPresupuesto);

// Obtener saldo disponible (sueldo - gastos en el período)
router.get("/saldo", verifyToken, obtenerSaldo);

module.exports = router;
