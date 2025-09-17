// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import API from "../api";

// Íconos de MUI
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

  // 🔹 Colores para el gráfico
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AB47BC", "#FF5252"];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido {user?.nombre || "al Dashboard de GastoSmart"}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography>
          Aquí tienes un resumen de tus gastos y categorías.  
          Usa el menú lateral para gestionarlos.
        </Typography>
      </Paper>

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
                  <Typography variant="h4">${totalGeneral}</Typography>
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
                    <Typography variant="h5">${cat.total}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Gráfico circular de distribución */}
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Gastos por Categoría
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={totalesPorCategoria}
                  dataKey="total"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {totalesPorCategoria.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
