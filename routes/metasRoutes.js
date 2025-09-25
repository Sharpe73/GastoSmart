const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  crearMeta,
  obtenerMetas,
  actualizarAhorro,
  eliminarMeta,
} = require("../controllers/metasController");

// Crear meta
router.post("/", verifyToken, crearMeta);

// Obtener metas de usuario
router.get("/", verifyToken, obtenerMetas);

// Actualizar ahorro (aporte/retiro)
router.put("/:id", verifyToken, actualizarAhorro);

// Eliminar meta
router.delete("/:id", verifyToken, eliminarMeta);

module.exports = router;
