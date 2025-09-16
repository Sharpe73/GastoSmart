const pool = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 Registrar usuario
async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Verificar si el email ya existe
    const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const nuevoUsuario = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, creado_en",
      [nombre, email, hashedPassword]
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
      return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    const user = usuario.rows[0];

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, user.password);
    if (!esValida) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // payload
      process.env.JWT_SECRET,             // clave secreta
      { expiresIn: "2h" }                 // tiempo de expiración
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
}

module.exports = { register, login };
