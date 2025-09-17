import React, { useEffect, useState } from "react";
import { Typography, Container, Paper } from "@mui/material";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Reportes() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await API.get("/reportes/gastos-por-mes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Normalizar los datos para el gráfico
        const formatted = res.data.map((item) => ({
          mes: `${item.anio}-${item.mes}`,
          total: Number(item.total),
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error cargando reportes:", err);
      }
    };

    fetchReportes();
  }, [token]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Reportes de Gastos
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gastos por Mes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
}
