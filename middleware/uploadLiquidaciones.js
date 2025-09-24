// middleware/uploadLiquidaciones.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📂 Carpeta donde se guardarán los PDFs
const uploadDir = path.join(__dirname, "../uploads");

// Si no existe la carpeta, la creamos automáticamente
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Guardar en /uploads
  },
  filename: (req, file, cb) => {
    // Nombre único: usuarioId_fecha.pdf
    const usuarioId = req.user ? req.user.id : "anon";
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `liq_${usuarioId}_${timestamp}${ext}`);
  },
});

// Filtro para aceptar solo PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
