const pool = require("../models/db");

// 🔹 Crear una meta
async function crearMeta(req, res) {
  try {
    const { nombre, objetivo } = req.body;
    const usuario_id = req.user.id;

    if (!nombre || !objetivo) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    const nueva = await pool.query(
      "INSERT INTO metas_ahorro (usuario_id, nombre, objetivo) VALUES ($1, $2, $3) RETURNING *",
      [usuario_id, nombre, objetivo]
    );

    res.json(nueva.rows[0]);
  } catch (err) {
    console.error("❌ Error en crearMeta:", err);
    res.status(500).json({ mensaje: "Error al crear meta" });
  }
}

// 🔹 Obtener metas del usuario con % de avance y estado
async function obtenerMetas(req, res) {
  try {
    const usuario_id = req.user.id;
    const metas = await pool.query(
      "SELECT * FROM metas_ahorro WHERE usuario_id = $1 ORDER BY creado_en DESC",
      [usuario_id]
    );

    const metasConAvance = metas.rows.map((meta) => {
      const porcentaje = Math.min(
        100,
        Math.round((meta.ahorrado / meta.objetivo) * 100)
      );

      let estado = "En progreso";
      if (porcentaje >= 100) estado = "Completada";
      if (meta.ahorrado > meta.objetivo) estado = "Superada";

      return {
        ...meta,
        porcentaje,
        estado,
      };
    });

    res.json(metasConAvance);
  } catch (err) {
    console.error("❌ Error en obtenerMetas:", err);
    res.status(500).json({ mensaje: "Error al obtener metas" });
  }
}

// 🔹 Actualizar ahorro (aporte/retiro)
async function actualizarAhorro(req, res) {
  try {
    const { id } = req.params;
    const { monto } = req.body;

    if (!monto) {
      return res.status(400).json({ mensaje: "Monto requerido" });
    }

    const meta = await pool.query(
      "UPDATE metas_ahorro SET ahorrado = GREATEST(0, ahorrado + $1) WHERE id = $2 RETURNING *",
      [monto, id]
    );

    res.json(meta.rows[0]);
  } catch (err) {
    console.error("❌ Error en actualizarAhorro:", err);
    res.status(500).json({ mensaje: "Error al actualizar ahorro" });
  }
}

// 🔹 Eliminar meta
async function eliminarMeta(req, res) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM metas_ahorro WHERE id = $1", [id]);
    res.json({ mensaje: "Meta eliminada" });
  } catch (err) {
    console.error("❌ Error en eliminarMeta:", err);
    res.status(500).json({ mensaje: "Error al eliminar meta" });
  }
}

module.exports = { crearMeta, obtenerMetas, actualizarAhorro, eliminarMeta };
