// routes/liquidacionesRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  subirLiquidacion,
  listarLiquidaciones,
  descargarLiquidacion,
} = require("../controllers/liquidacionesController");
const verificarToken = require("../middleware/authMiddleware"); // 👈 cambiado

// ⚙️ Configuración de multer en memoria (no en disco)
const storage = multer.memoryStorage();

// Solo permitir PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({ storage, fileFilter });

// 📌 Rutas protegidas
router.post("/", verificarToken, upload.single("archivo"), subirLiquidacion);
router.get("/", verificarToken, listarLiquidaciones);
router.get("/:id/descargar", verificarToken, descargarLiquidacion);

module.exports = router;
