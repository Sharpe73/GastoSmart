const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ mensaje: "❌ Token no proporcionado" });
  }

  // Esperamos el formato: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ mensaje: "❌ Formato de token inválido. Usa 'Bearer <token>'" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario (id, email, etc.)
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error.message);
    return res.status(403).json({ mensaje: "❌ Token inválido o expirado" });
  }
}

module.exports = verificarToken;
