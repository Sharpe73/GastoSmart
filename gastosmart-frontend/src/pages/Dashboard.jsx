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
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import API from "../api";

// Íconos de MUI
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // ✅ Nuevo ícono financiero

function Dashboard() {
  const [user, setUser] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    }

    const fetchData = async () => {
      try {
        const gastoRes = await API.get("/gastos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGastos(gastoRes.data.gastos || gastoRes.data);

        const catRes = await API.get("/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(catRes.data.categorias || catRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, [token]);

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

      {/* ✅ Alert con ícono financiero */}
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
        <strong>
          ${totalGeneral.toLocaleString("es-CL")}
        </strong>{" "}
        en gastos distribuidos en{" "}
        <strong>{categorias.length}</strong> categorías.
      </Alert>

      <Grid container spacing={3}>
        {/* Tarjeta total general */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 4, bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total de Gastos</Typography>
                  <Typography variant="h4">
                    ${totalGeneral.toLocaleString("es-CL")}
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
