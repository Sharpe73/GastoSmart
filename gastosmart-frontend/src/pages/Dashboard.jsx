// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import API from "../api";

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
        {/* Total general */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Total de Gastos</Typography>
              <Typography variant="h4">${totalGeneral}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Totales por categoría */}
        {totalesPorCategoria.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{cat.nombre}</Typography>
                <Typography variant="h5">${cat.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;
