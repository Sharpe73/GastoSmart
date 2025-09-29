const pool = require("../models/db"); // 👈 conexión a la BD

// Utilidad para formatear fechas a YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return null;
  // 👇 Si es objeto Date, lo pasamos a YYYY-MM-DD
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  // 👇 Si ya es string (ej: '2025-09-01'), lo devolvemos directo
  if (typeof date === "string") {
    return date;
  }
  return String(date);
};

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
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
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

      const row = result.rows[0];
      return res.json({
        ...row,
        fecha_inicio: formatDate(row.fecha_inicio),
        fecha_fin: formatDate(row.fecha_fin),
      });
    }

    // Si no existe, crear uno nuevo
    const result = await pool.query(
      "INSERT INTO presupuestos (usuario_id, sueldo, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4) RETURNING *",
      [usuario_id, sueldo, fecha_inicio, fecha_fin]
    );

    const row = result.rows[0];
    res.json({
      ...row,
      fecha_inicio: formatDate(row.fecha_inicio),
      fecha_fin: formatDate(row.fecha_fin),
    });
  } catch (error) {
    console.error("❌ Error al crear presupuesto:", error);
    res.status(500).json({ error: "Error al guardar presupuesto" });
  }
};

// Obtener presupuesto actual con detección de cambio de mes
const obtenerPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const hoy = new Date();

    const result = await pool.query(
      "SELECT * FROM presupuestos WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 1",
      [usuario_id]
    );

    // 🚀 Si no hay presupuesto → crear uno inicial vacío automáticamente
    if (result.rows.length === 0) {
      const fechaInicioNueva = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const fechaFinNueva = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      const nuevo = await pool.query(
        "INSERT INTO presupuestos (usuario_id, sueldo, fecha_inicio, fecha_fin) VALUES ($1,$2,$3,$4) RETURNING *",
        [usuario_id, 0, fechaInicioNueva, fechaFinNueva] // sueldo inicial = 0
      );

      const row = nuevo.rows[0];
      return res.json({
        ...row,
        fecha_inicio: formatDate(row.fecha_inicio),
        fecha_fin: formatDate(row.fecha_fin),
      });
    }

    let presupuesto = result.rows[0];

    // Si ya terminó el periodo → mover a históricos y crear nuevo
    if (new Date(presupuesto.fecha_fin) < hoy) {
      console.log("📌 Presupuesto finalizado, revisando para mover a históricos...");

      // Calcular total de gastos del periodo
      const gastosRes = await pool.query(
        "SELECT COALESCE(SUM(monto),0) as total FROM gastos WHERE usuario_id=$1 AND fecha BETWEEN $2 AND $3",
        [usuario_id, presupuesto.fecha_inicio, presupuesto.fecha_fin]
      );
      const totalGastos = parseFloat(gastosRes.rows[0].total) || 0;
      const saldoRestante = parseFloat(presupuesto.sueldo) - totalGastos;

      // Traer snapshot de gastos detallados
      const gastosDetalle = await pool.query(
        `SELECT g.id, g.descripcion, g.monto, g.fecha, c.nombre AS categoria
         FROM gastos g
         LEFT JOIN categorias c ON g.categoria_id = c.id
         WHERE g.usuario_id = $1 AND g.fecha BETWEEN $2 AND $3`,
        [usuario_id, presupuesto.fecha_inicio, presupuesto.fecha_fin]
      );

      // Traer snapshot de categorías
      const categoriasDetalle = await pool.query(
        `SELECT id, nombre
         FROM categorias
         WHERE usuario_id = $1`,
        [usuario_id]
      );

      // Guardar SIEMPRE en historicos, aunque no haya gastos
      await pool.query(
        `INSERT INTO historicos 
          (usuario_id, mes, anio, sueldo, total_gastado, saldo_restante, categorias, gastos)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          usuario_id,
          new Date(presupuesto.fecha_fin).getMonth() + 1, // mes
          new Date(presupuesto.fecha_fin).getFullYear(), // año
          presupuesto.sueldo,
          totalGastos,
          saldoRestante,
          JSON.stringify(categoriasDetalle.rows),
          JSON.stringify(gastosDetalle.rows),
        ]
      );
      console.log("✅ Histórico guardado correctamente (incluyendo sin movimientos).");

      // Crear nuevo presupuesto del mes actual
      const fechaInicioNueva = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const fechaFinNueva = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      const nuevoRes = await pool.query(
        "INSERT INTO presupuestos (usuario_id, sueldo, fecha_inicio, fecha_fin) VALUES ($1,$2,$3,$4) RETURNING *",
        [usuario_id, presupuesto.sueldo, fechaInicioNueva, fechaFinNueva]
      );

      presupuesto = nuevoRes.rows[0]; // el que se devuelve al frontend
    }

    res.json({
      ...presupuesto,
      fecha_inicio: formatDate(presupuesto.fecha_inicio),
      fecha_fin: formatDate(presupuesto.fecha_fin),
    });
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
      fecha_inicio: formatDate(presupuesto.fecha_inicio),
      fecha_fin: formatDate(presupuesto.fecha_fin),
    });
  } catch (error) {
    console.error("❌ Error al obtener saldo:", error);
    res.status(500).json({ error: "Error al obtener saldo" });
  }
};

module.exports = { crearPresupuesto, obtenerPresupuesto, obtenerSaldo };
