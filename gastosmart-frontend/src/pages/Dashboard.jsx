// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import API from "../api";
import { obtenerIndicadores } from "../api/indicadores"; // 👈 Importar función externa

// Íconos de MUI
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [presupuesto, setPresupuesto] = useState(null);
  const [indicadores, setIndicadores] = useState(null); // 👈 Estado para indicadores
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("❌ Error al decodificar token:", err);
      }
    }

    const fetchData = async () => {
      try {
        // ✅ Presupuesto
        const preRes = await API.get("/presupuesto", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPresupuesto(preRes.data);

        // ✅ Gastos
        const gastoRes = await API.get("/gastos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGastos(gastoRes.data.gastos || gastoRes.data);

        // ✅ Categorías
        const catRes = await API.get("/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(catRes.data.categorias || catRes.data);

        // ✅ Indicadores externos
        const indData = await obtenerIndicadores();
        setIndicadores(indData);
      } catch (err) {
        console.error("❌ Error al cargar datos del Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando resumen financiero...
        </Typography>
      </Box>
    );
  }

  // 🔹 Calcular totales
  const totalGeneral = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

  const totalesPorCategoria = categorias.map((cat) => {
    const totalCat = gastos
      .filter((g) => g.categoria_id === cat.id)
      .reduce((sum, g) => sum + Number(g.monto), 0);
    return { ...cat, total: totalCat };
  });

  // 🔹 Colores para las tarjetas
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AB47BC",
    "#FF5252",
  ];

  // 🔹 Estilo base de tarjeta
  const cardStyle = {
    boxShadow: 4,
    minHeight: isMobile ? 90 : 110,
  };

  // 🔹 Estilo de contenido
  const contentStyle = {
    p: isMobile ? 1 : 2,
  };

  // 🔹 Tipografías responsivas
  const titleVariant = isMobile ? "caption" : "subtitle1";
  const amountVariant = isMobile ? "body1" : "h6";

  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Bienvenido {user?.nombre || "al Dashboard de GastoSmart"}
      </Typography>

      {/* 🔹 Indicadores pequeños en la parte superior */}
      {indicadores && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-end",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              UF:
            </Typography>
            <Typography variant="body2">
              ${indicadores.uf.toLocaleString("es-CL")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#388e3c" }}>
              Dólar:
            </Typography>
            <Typography variant="body2">
              ${indicadores.dolar.toLocaleString("es-CL")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#6a1b9a" }}>
              UTM:
            </Typography>
            <Typography variant="body2">
              ${indicadores.utm.toLocaleString("es-CL")}
            </Typography>
          </Box>
        </Box>
      )}

      {/* ✅ Alert con información financiera + periodo */}
      <Alert
        icon={<TrendingUpIcon fontSize="inherit" />}
        severity="info"
        sx={{
          mb: 4,
          fontSize: isMobile ? "0.9rem" : "1rem",
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <strong>{user?.nombre}</strong>, este es tu resumen financiero
        actualizado. Actualmente tienes un total de{" "}
        <strong>${totalGeneral.toLocaleString("es-CL")}</strong> en gastos
        distribuidos en <strong>{categorias.length}</strong> categorías.
        <br />
        📅 Período:{" "}
        <strong>
          {new Date(presupuesto.fecha_inicio).toLocaleDateString("es-CL")} →{" "}
          {new Date(presupuesto.fecha_fin).toLocaleDateString("es-CL")}
        </strong>
      </Alert>

      <Grid container spacing={3}>
        {/* Tarjeta presupuesto inicial */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyle, bgcolor: "success.main", color: "white" }}>
            <CardContent sx={contentStyle}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "success.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant={titleVariant}>Sueldo inicial</Typography>
                  <Typography variant={amountVariant}>
                    ${Number(presupuesto.sueldo).toLocaleString("es-CL")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta total gastado */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyle, bgcolor: "primary.main", color: "white" }}>
            <CardContent sx={contentStyle}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant={titleVariant}>Total Gastado</Typography>
                  <Typography variant={amountVariant}>
                    ${totalGeneral.toLocaleString("es-CL")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta saldo restante */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ ...cardStyle, bgcolor: "error.main", color: "white" }}>
            <CardContent sx={contentStyle}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "error.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant={titleVariant}>Saldo Restante</Typography>
                  <Typography variant={amountVariant}>
                    ${(
                      Number(presupuesto.sueldo) - totalGeneral
                    ).toLocaleString("es-CL")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjetas por categoría */}
        {totalesPorCategoria.map((cat, index) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card sx={{ ...cardStyle, boxShadow: 2 }}>
              <CardContent sx={contentStyle}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant={titleVariant}>{cat.nombre}</Typography>
                    <Typography variant={amountVariant}>
                      ${cat.total.toLocaleString("es-CL")}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;
