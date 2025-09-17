// src/pages/Reportes.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API from "../api";

export default function Reportes() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
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

  // 🔹 Calcular totales por categoría
  const data = categorias.map((cat) => {
    const totalCat = gastos
      .filter((g) => g.categoria_id === cat.id)
      .reduce((sum, g) => sum + Number(g.monto), 0);
    return { name: cat.nombre, value: totalCat };
  });

  // 🔹 Colores para cada categoría
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9C27B0", "#E91E63"];

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Reportes de Gastos
      </Typography>

      <Paper sx={{ p: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Distribución de Gastos por Categoría
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: $${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
}
