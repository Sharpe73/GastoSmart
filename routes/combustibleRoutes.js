// routes/combustibleRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "Se requieren lat y lng" });
    }

    // 🔹 Llamada a la API pública con fetch nativo de Node 18+
    const response = await fetch(
      `https://api.bencinaenlinea.cl/v1/estaciones?lat=${lat}&lng=${lng}&limit=5`
    );
    const data = await response.json();

    // 🔹 Precios mínimos por tipo de combustible
    const precios = { b93: null, b95: null, b97: null, diesel: null };

    data.forEach((est) => {
      est.combustibles.forEach((c) => {
        let key = null;
        if (c.nombre.includes("93")) key = "b93";
        if (c.nombre.includes("95")) key = "b95";
        if (c.nombre.includes("97")) key = "b97";
        if (c.nombre.toLowerCase().includes("diesel")) key = "diesel";

        if (key) {
          if (precios[key] === null || c.precio < precios[key]) {
            precios[key] = c.precio;
          }
        }
      });
    });

    res.json(precios);
  } catch (err) {
    console.error("❌ Error en /combustible:", err);
    res.status(500).json({ error: "Error al obtener precios de combustible" });
  }
});

module.exports = router;
