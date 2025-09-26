import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SavingsIcon from "@mui/icons-material/Savings";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api";
import { jwtDecode } from "jwt-decode";

function MetasAhorro() {
  const [metas, setMetas] = useState([]);
  const [aportes, setAportes] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState({ nombre: "", objetivo: "" });
  const [montoInputs, setMontoInputs] = useState({});
  const [aporteAEliminar, setAporteAEliminar] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [metaSeleccionada, setMetaSeleccionada] = useState(null);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  // 🔹 Cargar metas
  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const res = await API.get("/metas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const metasConCalculo = res.data.map((m) => {
          const porcentaje = Math.min(
            100,
            Math.round((m.ahorrado / m.objetivo) * 100)
          );
          const estado = porcentaje >= 100 ? "Completada" : "En progreso";
          return { ...m, porcentaje, estado };
        });

        setMetas(metasConCalculo);

        const inicialInputs = {};
        metasConCalculo.forEach((m) => {
          inicialInputs[m.id] = ""; // 👈 iniciar vacío
          fetchAportes(m.id);
        });
        setMontoInputs(inicialInputs);
      } catch (err) {
        console.error("❌ Error cargando metas:", err);
      }
    };
    if (token) fetchMetas();
  }, [token]);

  // 🔹 Cargar aportes de una meta
  const fetchAportes = async (metaId) => {
    try {
      const res = await API.get(`/aportes/${metaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAportes((prev) => ({ ...prev, [metaId]: res.data }));
    } catch (err) {
      console.error("❌ Error cargando aportes:", err);
    }
  };

  // 🔹 Modal crear meta
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => {
    setOpenDialog(false);
    setNuevaMeta({ nombre: "", objetivo: "" });
  };

  // 🔹 Guardar meta
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
      setMontoInputs({ ...montoInputs, [meta.id]: "" }); // 👈 iniciar vacío
      fetchAportes(meta.id);
      handleClose();
    } catch (err) {
      console.error("❌ Error al guardar meta:", err);
    }
  };

  // 🔹 Aporte o retiro
  const actualizarAhorro = async (id, monto) => {
    if (!monto || monto === 0) return;
    try {
      await API.post(
        "/aportes",
        { meta_id: id, monto },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAportes(id);
      const resMeta = await API.get("/metas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const metasConCalculo = resMeta.data.map((m) => {
        const porcentaje = Math.min(
          100,
          Math.round((m.ahorrado / m.objetivo) * 100)
        );
        const estado = porcentaje >= 100 ? "Completada" : "En progreso";
        return { ...m, porcentaje, estado };
      });
      setMetas(metasConCalculo);
      setMontoInputs({ ...montoInputs, [id]: "" }); // 👈 reset vacío
    } catch (err) {
      console.error("❌ Error al registrar aporte:", err);
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

  // 🔹 Abrir detalle de una meta
  const abrirDetalle = (meta) => {
    setMetaSeleccionada(meta);
    setOpenDetalle(true);
    fetchAportes(meta.id);
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

                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => abrirDetalle(meta)}
                  >
                    Ver Detalle
                  </Button>
                </CardContent>
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

      {/* 🔹 Modal detalle de meta */}
      <Dialog
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        fullWidth
        maxWidth="sm"
      >
        {metaSeleccionada && (
          <>
            <DialogTitle>{metaSeleccionada.nombre}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Objetivo: ${Number(metaSeleccionada.objetivo).toLocaleString("es-CL")}
                </Typography>
                <Typography variant="subtitle1">
                  Ahorrado: ${Number(metaSeleccionada.ahorrado).toLocaleString("es-CL")}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={metaSeleccionada.porcentaje || 0}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    mt: 1,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="caption">
                    {metaSeleccionada.porcentaje}% completado
                  </Typography>
                  <Chip
                    label={metaSeleccionada.estado}
                    color={metaSeleccionada.estado === "Completada" ? "success" : "primary"}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Historial de aportes:
              </Typography>

              {/* Scroll interno */}
              <Box sx={{ maxHeight: 250, overflowY: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Monto</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell align="right">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(aportes[metaSeleccionada.id] || []).map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>${Number(a.monto).toLocaleString("es-CL")}</TableCell>
                        <TableCell>{new Date(a.fecha).toLocaleString("es-CL")}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() =>
                              setAporteAEliminar({ id: a.id, metaId: metaSeleccionada.id })
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                <TextField
                  type="number"
                  size="small"
                  label="Monto"
                  value={montoInputs[metaSeleccionada.id] ?? ""} // 👈 vacío si no hay valor
                  onChange={(e) =>
                    setMontoInputs({
                      ...montoInputs,
                      [metaSeleccionada.id]:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  sx={{ flex: 1 }}
                />
                <IconButton
                  color="success"
                  disabled={montoInputs[metaSeleccionada.id] === ""} // 👈 no permite usar vacío
                  onClick={() =>
                    actualizarAhorro(
                      metaSeleccionada.id,
                      Number(montoInputs[metaSeleccionada.id])
                    )
                  }
                >
                  <AddCircleIcon />
                </IconButton>
                <IconButton
                  color="error"
                  disabled={montoInputs[metaSeleccionada.id] === ""}
                  onClick={() =>
                    actualizarAhorro(
                      metaSeleccionada.id,
                      -Number(montoInputs[metaSeleccionada.id])
                    )
                  }
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => eliminarMeta(metaSeleccionada.id)}
              >
                Eliminar Meta
              </Button>
              <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default MetasAhorro;
