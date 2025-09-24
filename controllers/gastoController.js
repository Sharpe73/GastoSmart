const pool = require("../models/db");

// Crear un gasto
async function crearGasto(req, res) {
  try {
    const usuario_id = req.user.id; // 👈 viene del token
    const { descripcion, monto, categoria_id } = req.body;
    const archivo = req.file ? req.file.buffer : null; // 👈 buffer en memoria

    if (!descripcion || !monto) {
      return res
        .status(400)
        .json({ mensaje: "Descripción y monto son obligatorios" });
    }

    // 🔹 1. Obtener presupuesto actual del usuario
    const presupuestoRes = await pool.query(
      `SELECT sueldo, fecha_inicio, fecha_fin 
       FROM presupuestos
       WHERE usuario_id = $1 
       ORDER BY id DESC 
       LIMIT 1`,
      [usuario_id]
    );

    if (presupuestoRes.rows.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "No tienes un presupuesto definido" });
    }

    const presupuesto = presupuestoRes.rows[0];

    // 🔹 2. Calcular total de gastos ya registrados
    const gastosRes = await pool.query(
      `SELECT COALESCE(SUM(monto), 0) AS total_gastos 
       FROM gastos 
       WHERE usuario_id = $1`,
      [usuario_id]
    );

    const totalGastos = Number(gastosRes.rows[0].total_gastos);
    const saldoRestante = presupuesto.sueldo - totalGastos;

    // 🔹 3. Validaciones
    if (saldoRestante <= 0) {
      return res.status(400).json({
        mensaje: "❌ No puedes agregar más gastos, el presupuesto está agotado",
        saldoRestante,
      });
    }

    if (Number(monto) > saldoRestante) {
      return res.status(400).json({
        mensaje: `⚠️ El gasto sobrepasa tu presupuesto. Te quedan $${saldoRestante.toLocaleString(
          "es-CL"
        )}, pero intentas registrar $${Number(monto).toLocaleString("es-CL")}.`,
        saldoRestante,
      });
    }

    // 🔹 4. Fecha sin desfase (solo YYYY-MM-DD)
    const hoy = new Date().toISOString().split("T")[0];

    // 🔹 5. Insertar el gasto
    const nuevoGasto = await pool.query(
      `INSERT INTO gastos (usuario_id, descripcion, monto, categoria_id, archivo, fecha)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, descripcion, monto, categoria_id, fecha, creado_en,
                 (CASE WHEN archivo IS NOT NULL THEN true ELSE false END) AS tiene_archivo`,
      [usuario_id, descripcion, monto, categoria_id || null, archivo, hoy]
    );

    res.status(201).json({
      mensaje: "✅ Gasto creado exitosamente",
      gasto: nuevoGasto.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al crear gasto:", error);
    res.status(500).json({ mensaje: "Error al crear gasto" });
  }
}

// Listar todos los gastos del usuario autenticado
async function listarGastos(req, res) {
  try {
    const usuario_id = req.user.id;

    const gastos = await pool.query(
      `SELECT g.id, g.descripcion, g.monto, g.categoria_id, g.fecha, g.creado_en, 
              (CASE WHEN g.archivo IS NOT NULL THEN true ELSE false END) AS tiene_archivo,
              c.nombre AS categoria_nombre
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.usuario_id = $1
       ORDER BY g.fecha DESC`,
      [usuario_id]
    );

    res.json({
      mensaje: "📋 Lista de gastos obtenida correctamente",
      total: gastos.rows.length,
      gastos: gastos.rows,
    });
  } catch (error) {
    console.error("❌ Error al listar gastos:", error);
    res.status(500).json({ mensaje: "Error al listar gastos" });
  }
}

// Descargar archivo asociado a un gasto
async function descargarArchivo(req, res) {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const gasto = await pool.query(
      "SELECT archivo FROM gastos WHERE id = $1 AND usuario_id = $2",
      [id, usuario_id]
    );

    if (gasto.rows.length === 0 || !gasto.rows[0].archivo) {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }

    // 🔹 Configurar headers para abrir/descargar siempre como PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="documento-gasto-${id}.pdf"`
    );

    res.send(gasto.rows[0].archivo);
  } catch (error) {
    console.error("❌ Error al descargar archivo:", error);
    res.status(500).json({ mensaje: "Error al descargar archivo" });
  }
}

// Actualizar un gasto
async function actualizarGasto(req, res) {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;
    const { descripcion, monto, categoria_id } = req.body;
    const archivo = req.file ? req.file.buffer : null;

    const gasto = await pool.query(
      "SELECT * FROM gastos WHERE id = $1 AND usuario_id = $2",
      [id, usuario_id]
    );
    if (gasto.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "Gasto no encontrado o no autorizado" });
    }

    const actualizado = await pool.query(
      `UPDATE gastos 
       SET descripcion = $1, monto = $2, categoria_id = $3, archivo = COALESCE($4, archivo)
       WHERE id = $5
       RETURNING id, descripcion, monto, categoria_id, fecha, creado_en,
                 (CASE WHEN archivo IS NOT NULL THEN true ELSE false END) AS tiene_archivo`,
      [descripcion, monto, categoria_id || null, archivo, id]
    );

    res.json({
      mensaje: "✅ Gasto actualizado correctamente",
      gasto: actualizado.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al actualizar gasto:", error);
    res.status(500).json({ mensaje: "Error al actualizar gasto" });
  }
}

// Eliminar un gasto
async function eliminarGasto(req, res) {
  try {
    const usuario_id = req.user.id;
    const { id } = req.params;

    const gasto = await pool.query(
      "SELECT * FROM gastos WHERE id = $1 AND usuario_id = $2",
      [id, usuario_id]
    );
    if (gasto.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "Gasto no encontrado o no autorizado" });
    }

    await pool.query("DELETE FROM gastos WHERE id = $1", [id]);

    res.json({ mensaje: "🗑️ Gasto eliminado correctamente", id });
  } catch (error) {
    console.error("❌ Error al eliminar gasto:", error);
    res.status(500).json({ mensaje: "Error al eliminar gasto" });
  }
}

module.exports = {
  crearGasto,
  listarGastos,
  actualizarGasto,
  eliminarGasto,
  descargarArchivo,
};
