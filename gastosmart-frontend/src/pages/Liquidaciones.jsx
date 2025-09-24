// src/pages/Liquidaciones.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Box,
  MenuItem,
  TextField,
} from "@mui/material";
import { CloudUpload, Download, PictureAsPdf } from "@mui/icons-material";
import API from "../api";

function Liquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear());

  // 🔹 Cargar lista al inicio
  useEffect(() => {
    cargarLiquidaciones();
  }, []);

  const cargarLiquidaciones = async () => {
    try {
      const res = await API.get("/liquidaciones");
      setLiquidaciones(res.data.liquidaciones);
    } catch (error) {
      console.error("❌ Error al cargar liquidaciones:", error);
    }
  };

  // 🔹 Subir nueva liquidación
  const subirLiquidacion = async () => {
    if (!archivo || !mes || !anio) return alert("Completa mes, año y archivo");

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("mes", mes);
    formData.append("anio", anio);

    try {
      await API.post("/liquidaciones", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setArchivo(null);
      setMes("");
      setAnio(new Date().getFullYear());
      cargarLiquidaciones(); // refrescar lista
    } catch (error) {
      console.error("❌ Error al subir liquidación:", error);
    }
  };

  // 🔹 Descargar
  const descargarLiquidacion = (id) => {
    window.open(`${process.env.REACT_APP_API_URL}/liquidaciones/${id}/descargar`);
  };

  // Colores dinámicos por mes
  const coloresMes = [
    "#1976d2", "#388e3c", "#f57c00", "#6a1b9a",
    "#c2185b", "#00796b", "#512da8", "#d32f2f",
    "#0288d1", "#7b1fa2", "#fbc02d", "#455a64",
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Liquidaciones de Sueldo
      </Typography>

      {/* Subir nueva */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 4 }}>
        <TextField
          select
          label="Mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {[
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ].map((nombre, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              {nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Año"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          sx={{ width: 100 }}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setArchivo(e.target.files[0])}
        />

        <IconButton
          color="primary"
          onClick={subirLiquidacion}
          disabled={!archivo || !mes || !anio}
        >
          <CloudUpload fontSize="large" />
        </IconButton>
      </Box>

      {/* Listado en tarjetas */}
      <Grid container spacing={3}>
        {liquidaciones.map((liq) => {
          const color = coloresMes[(liq.mes - 1) % 12];
          return (
            <Grid item xs={12} sm={6} md={4} key={liq.id}>
              <Card
                sx={{
                  boxShadow: 4,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <PictureAsPdf sx={{ fontSize: 60, color: "red" }} />
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold", color }}>
                    {liq.mes}/{liq.anio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subida: {new Date(liq.creado_en).toLocaleDateString("es-CL")}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <IconButton
                    color="primary"
                    onClick={() => descargarLiquidacion(liq.id)}
                  >
                    <Download fontSize="large" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default Liquidaciones;
