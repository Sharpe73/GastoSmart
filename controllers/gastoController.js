const pool = require("../models/db");

// Crear un gasto
async function crearGasto(req, res) {
  try {
    const usuario_id = req.user.id; // 👈 viene del token
    const { descripcion, monto, categoria_id } = req.body;

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

    // 🔹 3. Validaciones más claras
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

    // 🔹 4. Insertar el gasto sin enviar fecha (la BD pone CURRENT_DATE)
    const nuevoGasto = await pool.query(
      `INSERT INTO gastos (usuario_id, descripcion, monto, categoria_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [usuario_id, descripcion, monto, categoria_id || null]
    );

    const gastoConCategoria = await pool.query(
      `SELECT g.*, c.nombre AS categoria_nombre
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.id = $1`,
      [nuevoGasto.rows[0].id]
    );

    res.status(201).json({
      mensaje: "✅ Gasto creado exitosamente",
      gasto: gastoConCategoria.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al crear gasto:", error);
    res.status(500).json({ mensaje: "Error al crear gasto" });
  }
}

// Listar todos los gastos del usuario autenticado
async function listarGastos(req, res) {
  try {
    const usuario_id = req.user.id; // 👈 se toma del token

    const gastos = await pool.query(
      `SELECT g.*, c.nombre AS categoria_nombre
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

// Actualizar un gasto
async function actualizarGasto(req, res) {
  try {
    const usuario_id = req.user.id; // 👈 asegurar que es del usuario autenticado
    const { id } = req.params;
    const { descripcion, monto, categoria_id } = req.body;

    const gasto = await pool.query(
      "SELECT * FROM gastos WHERE id = $1 AND usuario_id = $2",
      [id, usuario_id]
    );
    if (gasto.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "Gasto no encontrado o no autorizado" });
    }

    await pool.query(
      `UPDATE gastos 
       SET descripcion = $1, monto = $2, categoria_id = $3
       WHERE id = $4`,
      [descripcion, monto, categoria_id || null, id]
    );

    const actualizado = await pool.query(
      `SELECT g.*, c.nombre AS categoria_nombre
       FROM gastos g
       LEFT JOIN categorias c ON g.categoria_id = c.id
       WHERE g.id = $1`,
      [id]
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
};
