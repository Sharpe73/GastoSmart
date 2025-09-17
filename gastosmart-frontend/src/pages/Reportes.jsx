// src/pages/Reportes.jsx
import React, { useEffect, useState } from "react";
import { Typography, Container, Paper, Button } from "@mui/material";
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
  const [detalleDias, setDetalleDias] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const token = localStorage.getItem("token");

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // 🔹 Reporte por mes
  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await API.get("/reportes/gastos-por-mes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((item) => {
          const [anio, mes] = item.mes.split("-");
          return {
            rawMes: item.mes,
            mes: `${nombresMeses[parseInt(mes, 10) - 1]} ${anio}`,
            total: Number(item.total),
          };
        });

        setData(formatted);
      } catch (err) {
        console.error("Error cargando reportes:", err);
      }
    };

    fetchReportes();
  }, [token]);

  // 🔹 Reporte por día de un mes
  const fetchDetalleDias = async (anioMes, nombreMes) => {
    try {
      const res = await API.get(`/reportes/gastos-por-dia/${anioMes}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.map((item) => ({
        dia: `Día ${item.dia}`,
        total: Number(item.total),
      }));

      setDetalleDias(formatted);
      setMesSeleccionado(nombreMes);
    } catch (err) {
      console.error("Error cargando detalle por días:", err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Reportes de Gastos
      </Typography>

      {/* 🔹 Gráfico por mes */}
      {!mesSeleccionado && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gastos por Mes
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onClick={(e) => {
                if (e && e.activeLabel) {
                  const mesData = data.find((d) => d.mes === e.activeLabel);
                  if (mesData) {
                    fetchDetalleDias(mesData.rawMes, mesData.mes);
                  }
                }
              }}
            >
              <defs>
                <linearGradient id="colorMes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#90caf9" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="mes" tick={{ fill: "#555" }} />
              <YAxis tick={{ fill: "#555" }} />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              />
              <Bar
                dataKey="total"
                fill="url(#colorMes)"
                barSize={40}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* 🔹 Subgráfico por día */}
      {detalleDias.length > 0 && mesSeleccionado && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gastos por Día en {mesSeleccionado}
          </Typography>
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => {
              setDetalleDias([]);
              setMesSeleccionado(null);
            }}
          >
            ← Volver a vista mensual
          </Button>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={detalleDias}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9800" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#ffe0b2" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="dia" tick={{ fill: "#555" }} />
              <YAxis tick={{ fill: "#555" }} />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              />
              <Bar
                dataKey="total"
                fill="url(#colorDia)"
                barSize={40}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Container>
  );
}
