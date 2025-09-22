const pool = require("../models/db"); // 👈 corregido

// Crear un nuevo presupuesto
const crearPresupuesto = async (req, res) => {
  try {
    const { sueldo, fecha_inicio, fecha_fin } = req.body;
    const usuario_id = req.user.id; // tomado desde el token

    console.log("📌 Datos recibidos en crearPresupuesto:", {
      sueldo,
      fecha_inicio,
      fecha_fin,
      usuario_id,
    });

    if (!sueldo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe un presupuesto activo para el usuario
    const existe = await pool.query(
      "SELECT * FROM presupuestos WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 1",
      [usuario_id]
    );

    if (existe.rows.length > 0) {
      // actualizar el presupuesto más reciente
      const result = await pool.query(
        "UPDATE presupuestos SET sueldo = $1, fecha_inicio = $2, fecha_fin = $3, created_at = NOW() WHERE id = $4 RETURNING *",
        [sueldo, fecha_inicio, fecha_fin, existe.rows[0].id]
      );
      return res.json(result.rows[0]);
    }

    // Si no existe, crear uno nuevo
    const result = await pool.query(
      "INSERT INTO presupuestos (usuario_id, sueldo, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4) RETURNING *",
      [usuario_id, sueldo, fecha_inicio, fecha_fin]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al crear presupuesto:", error);
    res.status(500).json({ error: "Error al guardar presupuesto" });
  }
};

// Obtener el presupuesto actual
const obtenerPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const result = await pool.query(
      "SELECT * FROM presupuestos WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 1",
      [usuario_id]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener presupuesto:", error);
    res.status(500).json({ error: "Error al obtener presupuesto" });
  }
};

// Obtener saldo disponible (sueldo - gastos del período)
const obtenerSaldo = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    // Traer el presupuesto más reciente
    const presupuestoRes = await pool.query(
      "SELECT * FROM presupuestos WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 1",
      [usuario_id]
    );

    if (presupuestoRes.rows.length === 0) {
      return res.json({ mensaje: "No hay presupuesto definido" });
    }

    const presupuesto = presupuestoRes.rows[0];

    // Calcular gastos dentro del rango de fechas del presupuesto
    const gastosRes = await pool.query(
      "SELECT COALESCE(SUM(monto), 0) AS total_gastos FROM gastos WHERE usuario_id = $1 AND fecha >= $2 AND fecha <= $3",
      [usuario_id, presupuesto.fecha_inicio, presupuesto.fecha_fin]
    );

    const totalGastos = parseFloat(gastosRes.rows[0].total_gastos);
    const saldoRestante = parseFloat(presupuesto.sueldo) - totalGastos;

    res.json({
      sueldo: parseFloat(presupuesto.sueldo),
      totalGastos,
      saldoRestante,
      fecha_inicio: presupuesto.fecha_inicio,
      fecha_fin: presupuesto.fecha_fin,
    });
  } catch (error) {
    console.error("❌ Error al obtener saldo:", error);
    res.status(500).json({ error: "Error al obtener saldo" });
  }
};

module.exports = { crearPresupuesto, obtenerPresupuesto, obtenerSaldo };
