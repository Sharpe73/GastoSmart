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
} from "@mui/material";
import { CloudUpload, Download, PictureAsPdf } from "@mui/icons-material";
import API from "../api";

function Liquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [archivo, setArchivo] = useState(null);

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
    if (!archivo) return alert("Selecciona un archivo primero");

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      await API.post("/liquidaciones", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setArchivo(null);
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
    "#1976d2", // Enero
    "#388e3c", // Febrero
    "#f57c00", // Marzo
    "#6a1b9a", // Abril
    "#c2185b", // Mayo
    "#00796b", // Junio
    "#512da8", // Julio
    "#d32f2f", // Agosto
    "#0288d1", // Septiembre
    "#7b1fa2", // Octubre
    "#fbc02d", // Noviembre
    "#455a64", // Diciembre
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Liquidaciones de Sueldo
      </Typography>

      {/* Subir nueva */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setArchivo(e.target.files[0])}
        />
        <IconButton
          color="primary"
          onClick={subirLiquidacion}
          disabled={!archivo}
          sx={{ ml: 2 }}
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
