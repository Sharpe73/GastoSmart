const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const db = require("./models/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GastoSmart API",
      version: "1.0.0",
      description: "API para gestionar gastos personales de múltiples usuarios",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // Documentación estará en los archivos de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔹 Ruta base
app.get("/", (req, res) => {
  res.send("Bienvenido a GastoSmart API 🚀");
});

// 🔹 Importar rutas
const authRoutes = require("./routes/authRoutes");
const gastoRoutes = require("./routes/gastoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");

app.use("/auth", authRoutes);
app.use("/gastos", gastoRoutes);
app.use("/categorias", categoriaRoutes);

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📖 Swagger en http://localhost:${PORT}/api-docs`);
});
