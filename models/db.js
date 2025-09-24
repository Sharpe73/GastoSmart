const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL no está definida en las variables de entorno");
}

const isRailway = process.env.DATABASE_URL.includes("railway");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRailway ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(async (client) => {
    console.log("✅ Conectado a PostgreSQL");
    await client.query("SET TIME ZONE 'America/Santiago'");
    client.release();
  })
  .catch(err => console.error("❌ Error de conexión:", err));

module.exports = pool;
