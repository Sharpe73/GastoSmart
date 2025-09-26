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
import { CloudUpload, Download, PictureAsPdf, Visibility } from "@mui/icons-material";
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
    if (!archivo || !mes || !anio) return alert("Selecciona mes, año y archivo");

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
      cargarLiquidaciones(); // refrescar lista
    } catch (error) {
      console.error("❌ Error al subir liquidación:", error);
    }
  };

  // 🔹 Descargar con token
  const descargarLiquidacion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/liquidaciones/${id}/descargar`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `liquidacion-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error al descargar liquidación:", error);
      alert("No se pudo descargar la liquidación.");
    }
  };

  // 🔹 Ver PDF en navegador
  const verLiquidacion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/liquidaciones/${id}/descargar`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, "_blank"); // 👁️ abre el PDF en otra pestaña
    } catch (error) {
      console.error("❌ Error al visualizar liquidación:", error);
      alert("No se pudo abrir la liquidación.");
    }
  };

  // 🔹 Meses en español
  const nombresMes = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

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
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <TextField
          select
          label="Mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          sx={{ width: 140 }}
        >
          {nombresMes.map((nombre, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Año"
          type="number"
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
      <Grid container spacing={2}>
        {liquidaciones.map((liq) => {
          const color = coloresMes[(liq.mes - 1) % 12];
          const mesNombre = nombresMes[liq.mes - 1] || liq.mes;

          return (
            <Grid item xs={12} sm={6} md={3} key={liq.id}>
              <Card
                sx={{
                  boxShadow: 2,
                  borderRadius: 2,
                  maxWidth: 200,
                  mx: "auto",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <PictureAsPdf sx={{ fontSize: 36, color: "red" }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 1, fontWeight: "bold", color }}
                  >
                    {mesNombre} {liq.anio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subida:{" "}
                    {liq.created_at
                      ? new Date(liq.created_at).toLocaleDateString("es-CL")
                      : "Fecha no disponible"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 1, gap: 1 }}>
                  {/* 👁️ Ver PDF */}
                  <IconButton
                    color="primary"
                    onClick={() => verLiquidacion(liq.id)}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>

                  {/* ⬇️ Descargar PDF */}
                  <IconButton
                    color="secondary"
                    onClick={() => descargarLiquidacion(liq.id)}
                  >
                    <Download fontSize="small" />
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
