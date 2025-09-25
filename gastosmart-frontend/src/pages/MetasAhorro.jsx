// src/pages/MetasAhorro.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SavingsIcon from "@mui/icons-material/Savings";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import API from "../api"; // 👈 para consumir backend
import { jwtDecode } from "jwt-decode";

function MetasAhorro() {
  const [metas, setMetas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState({ nombre: "", objetivo: "" });
  const [montoInput, setMontoInput] = useState(0); // 👈 monto libre para aportes/retiros

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  // 🔹 Cargar metas desde backend
  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const res = await API.get("/metas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Si el backend no manda porcentaje/estado, lo calculamos acá
        const metasConCalculo = res.data.map((m) => {
          const porcentaje = Math.min(
            100,
            Math.round((m.ahorrado / m.objetivo) * 100)
          );
          const estado = porcentaje >= 100 ? "Completada" : "En progreso";
          return { ...m, porcentaje, estado };
        });

        setMetas(metasConCalculo);
      } catch (err) {
        console.error("❌ Error cargando metas:", err);
      }
    };
    if (token) fetchMetas();
  }, [token]);

  // 🔹 Abrir / cerrar modal
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setNuevaMeta({ nombre: "", objetivo: "" });
  };

  // 🔹 Guardar nueva meta en backend
  const handleGuardarMeta = async () => {
    if (!nuevaMeta.nombre || !nuevaMeta.objetivo) return;
    try {
      const res = await API.post(
        "/metas",
        { nombre: nuevaMeta.nombre, objetivo: nuevaMeta.objetivo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const meta = res.data;
      const porcentaje = Math.min(
        100,
        Math.round((meta.ahorrado / meta.objetivo) * 100)
      );
      const estado = porcentaje >= 100 ? "Completada" : "En progreso";

      setMetas([{ ...meta, porcentaje, estado }, ...metas]);
      handleClose();
    } catch (err) {
      console.error("❌ Error al guardar meta:", err);
    }
  };

  // 🔹 Registrar aporte o retiro en backend
  const actualizarAhorro = async (id, monto) => {
    if (!monto || monto === 0) return; // evitar valores vacíos
    try {
      const res = await API.put(
        `/metas/${id}`,
        { monto },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const meta = res.data;
      const porcentaje = Math.min(
        100,
        Math.round((meta.ahorrado / meta.objetivo) * 100)
      );
      const estado = porcentaje >= 100 ? "Completada" : "En progreso";

      setMetas(metas.map((m) => (m.id === id ? { ...meta, porcentaje, estado } : m)));
      setMontoInput(0); // reset input después de usarlo
    } catch (err) {
      console.error("❌ Error al actualizar ahorro:", err);
    }
  };

  // 🔹 Eliminar meta
  const eliminarMeta = async (id) => {
    try {
      await API.delete(`/metas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetas(metas.filter((m) => m.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar meta:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          🎯 Metas de Ahorro
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          Nueva Meta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {metas.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No tienes metas aún. ¡Crea una y comienza a ahorrar!
          </Typography>
        ) : (
          metas.map((meta) => (
            <Grid item xs={12} sm={6} md={4} key={meta.id}>
              <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">{meta.nombre}</Typography>
                    <SavingsIcon color="primary" />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Objetivo: ${Number(meta.objetivo).toLocaleString("es-CL")}
                  </Typography>
                  <Typography variant="body2">
                    Ahorrado: ${Number(meta.ahorrado).toLocaleString("es-CL")}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={meta.porcentaje || 0}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mt: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1, textAlign: "right" }}
                  >
                    {meta.porcentaje}% — {meta.estado}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between" }}>
                  {/* Campo monto libre */}
                  <TextField
                    type="number"
                    size="small"
                    label="Monto"
                    value={montoInput}
                    onChange={(e) => setMontoInput(Number(e.target.value))}
                    sx={{ width: "120px" }}
                  />
                  <Box>
                    <IconButton
                      color="success"
                      onClick={() => actualizarAhorro(meta.id, montoInput)}
                    >
                      <AddCircleIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => actualizarAhorro(meta.id, -montoInput)}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Box>
                  <Button color="error" onClick={() => eliminarMeta(meta.id)}>
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* 🔹 Modal nueva meta */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Nueva Meta de Ahorro</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre de la meta"
            fullWidth
            value={nuevaMeta.nombre}
            onChange={(e) =>
              setNuevaMeta({ ...nuevaMeta, nombre: e.target.value })
            }
          />
          <TextField
            label="Monto objetivo"
            type="number"
            fullWidth
            value={nuevaMeta.objetivo}
            onChange={(e) =>
              setNuevaMeta({ ...nuevaMeta, objetivo: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarMeta}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MetasAhorro;
