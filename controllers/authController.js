const pool = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail"); 

// 🔹 Registrar usuario
async function register(req, res) {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Verificar si el email ya existe
    const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const nuevoUsuario = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, email, creado_en",
      [nombre, apellido, email, hashedPassword]
    );

    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: nuevoUsuario.rows[0],
    });
  } catch (error) {
    console.error("❌ Error en register:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
}

// 🔹 Login de usuario
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    const user = usuario.rows[0];

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, user.password);
    if (!esValida) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    // ⚡ Si requiere cambiar la contraseña (clave temporal activa)
    if (user.requiere_cambio) {
      return res.json({
        mensaje: "Debes cambiar tu contraseña antes de continuar",
        requiereCambio: true,
        email: user.email, // lo enviamos al frontend para identificar al usuario
      });
    }

    // Generar token con nombre y apellido incluidos
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre, apellido: user.apellido },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
}

// 🔹 Solicitar clave temporal para recuperar contraseña
async function solicitarClaveTemporal(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ mensaje: "El correo es obligatorio" });
    }

    // Buscar usuario
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (usuario.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No existe un usuario con ese correo" });
    }

    // Generar clave temporal (8 caracteres aleatorios)
    const claveTemporal = crypto.randomBytes(4).toString("hex");
    const hashed = await bcrypt.hash(claveTemporal, 10);

    // Guardar clave temporal en la BD y marcar que requiere cambio
    await pool.query(
      "UPDATE usuarios SET password = $1, requiere_cambio = true WHERE email = $2",
      [hashed, email]
    );

    // Enviar correo con la clave temporal
    await sendEmail(
      email,
      "Recuperación de contraseña - GastoSmart",
      `Tu clave temporal es: ${claveTemporal}. Debes usarla para iniciar sesión y luego cambiarla.`
    );

    res.json({ mensaje: "Clave temporal enviada a tu correo" });
  } catch (error) {
    console.error("❌ Error en solicitarClaveTemporal:", error);
    res.status(500).json({ mensaje: "Error al generar clave temporal" });
  }
}

// 🔹 Cambiar contraseña después de clave temporal
async function resetPassword(req, res) {
  try {
    const { email, nuevaPassword } = req.body;

    if (!email || !nuevaPassword) {
      return res
        .status(400)
        .json({ mensaje: "Email y nueva contraseña son obligatorios" });
    }

    // Buscar usuario
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (usuario.rows.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No existe un usuario con ese correo" });
    }

    const user = usuario.rows[0];

    // Verificar que el usuario tenga clave temporal activa
    if (!user.requiere_cambio) {
      return res
        .status(400)
        .json({ mensaje: "Este usuario no tiene una clave temporal activa" });
    }

    // Evitar que use la misma clave temporal
    const esIgual = await bcrypt.compare(nuevaPassword, user.password);
    if (esIgual) {
      return res.status(400).json({
        mensaje: "La nueva contraseña no puede ser igual a la temporal",
      });
    }

    // Hashear y actualizar contraseña definitiva
    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await pool.query(
      "UPDATE usuarios SET password = $1, requiere_cambio = false WHERE email = $2",
      [hashed, email]
    );

    res.json({
      mensaje: "Contraseña actualizada correctamente, ahora puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    res.status(500).json({ mensaje: "Error al cambiar contraseña" });
  }
}

module.exports = { register, login, solicitarClaveTemporal, resetPassword };
