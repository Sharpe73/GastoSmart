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
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import API from "../api";

// Íconos de MUI
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
        // ✅ Presupuesto (con detección automática de cambio de mes)
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido {user?.nombre || "al Dashboard de GastoSmart"}
      </Typography>

      {/* ✅ Alert con información financiera + periodo */}
      <Alert
        icon={<TrendingUpIcon fontSize="inherit" />}
        severity="info"
        sx={{
          mb: 4,
          fontSize: "1.1rem",
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
          <Card sx={{ boxShadow: 4, bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "success.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Sueldo inicial</Typography>
                  <Typography variant="h4">
                    ${Number(presupuesto.sueldo).toLocaleString("es-CL")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta total gastado */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 4, bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Gastado</Typography>
                  <Typography variant="h4">
                    ${totalGeneral.toLocaleString("es-CL")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta saldo restante */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 4, bgcolor: "error.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "error.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Saldo Restante</Typography>
                  <Typography variant="h4">
                    $
                    {(
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
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{cat.nombre}</Typography>
                    <Typography variant="h5">
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
