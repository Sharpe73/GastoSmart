// src/pages/Combustible.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import API from "../api";

function Combustible() {
  const [ubicacion, setUbicacion] = useState(null);
  const [precios, setPrecios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tipo, setTipo] = useState("todos"); // filtro de bencina/diesel
  const token = localStorage.getItem("token");

  // 🔹 Pedir ubicación y consultar backend
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUbicacion({ lat, lng });

          try {
            const res = await API.get(`/combustible?lat=${lat}&lng=${lng}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setPrecios(res.data);
          } catch (err) {
            console.error("❌ Error al obtener combustible:", err);
            setError("No se pudo obtener información de combustible.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Debes permitir el acceso a tu ubicación para ver precios.");
          setLoading(false);
        }
      );
    } else {
      setError("Tu navegador no soporta geolocalización.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Buscando estaciones cercanas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!precios) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No hay datos de combustible disponibles.
      </Alert>
    );
  }

  // 🔹 Filtrar precios según selección
  const tiposDisponibles = [
    { key: "b93", label: "Bencina 93" },
    { key: "b95", label: "Bencina 95" },
    { key: "b97", label: "Bencina 97" },
    { key: "diesel", label: "Diésel" },
  ];

  const preciosFiltrados =
    tipo === "todos"
      ? tiposDisponibles
      : tiposDisponibles.filter((t) => t.key === tipo);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ⛽ Precios de Combustible
      </Typography>

      {ubicacion && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Ubicación detectada: {ubicacion.lat.toFixed(4)},{" "}
          {ubicacion.lng.toFixed(4)}
        </Typography>
      )}

      {/* 🔹 Selector de tipo de combustible */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Tipo de Combustible</InputLabel>
        <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <MenuItem value="todos">Todos</MenuItem>
          {tiposDisponibles.map((t) => (
            <MenuItem key={t.key} value={t.key}>
              {t.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {preciosFiltrados.map((t) => (
          <Grid item xs={12} sm={6} md={3} key={t.key}>
            <Card sx={{ boxShadow: 4, bgcolor: "#1976d2", color: "white" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
                    <LocalGasStationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{t.label}</Typography>
                    <Typography variant="h6">
                      {precios[t.key]
                        ? `$${precios[t.key].toLocaleString("es-CL")}`
                        : "-"}
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

export default Combustible;
