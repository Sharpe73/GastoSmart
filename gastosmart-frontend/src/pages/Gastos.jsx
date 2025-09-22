// src/pages/Gastos.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api";

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [saldo, setSaldo] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [gastoEdit, setGastoEdit] = useState(null);

  const token = localStorage.getItem("token");
  const location = useLocation();
  const categoriaSeleccionada = location.state?.categoriaId || "";
  const [categoriaNombre, setCategoriaNombre] = useState("");

  // 🔹 Cargar categorías, gastos y saldo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(catRes.data.categorias || catRes.data);

        if (categoriaSeleccionada) {
          const cat = (catRes.data.categorias || catRes.data).find(
            (c) => c.id === Number(categoriaSeleccionada)
          );
          if (cat) setCategoriaNombre(cat.nombre);
        }

        const gastoRes = await API.get("/gastos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (categoriaSeleccionada) {
          const catId = Number(categoriaSeleccionada);
          setGastos(
            (gastoRes.data.gastos || gastoRes.data).filter(
              (g) => g.categoria_id === catId
            )
          );
          setCategoriaId(catId);
        } else {
          setGastos(gastoRes.data.gastos || gastoRes.data);
        }

        // 👇 obtener saldo actual
        const saldoRes = await API.get("/presupuesto/saldo");
        setSaldo(saldoRes.data);
      } catch (err) {
        setMensaje({
          tipo: "error",
          texto: "❌ Error al cargar datos. Intenta nuevamente.",
        });
      }
    };

    fetchData();
  }, [token, categoriaSeleccionada]);

  // 🔹 Agregar gasto
  const handleAddGasto = async () => {
    if (!descripcion || !monto || !categoriaId) {
      setMensaje({ tipo: "error", texto: "⚠️ Todos los campos son obligatorios." });
      return;
    }

    if (saldo && saldo.saldoRestante <= 0) {
      setMensaje({
        tipo: "warning",
        texto: "⚠️ Tu presupuesto está agotado. No puedes registrar más gastos.",
      });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const res = await API.post(
        "/gastos",
        {
          usuario_id: decoded.id,
          descripcion,
          monto,
          categoria_id: Number(categoriaId),
          fecha: new Date().toISOString().split("T")[0],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGastos([res.data.gasto, ...gastos]);
      setDescripcion("");
      setMonto("");
      setCategoriaId(
        categoriaSeleccionada ? Number(categoriaSeleccionada) : ""
      );
      setMensaje({ tipo: "success", texto: "✅ Gasto agregado correctamente." });

      // actualizar saldo después de agregar gasto
      const saldoRes = await API.get("/presupuesto/saldo");
      setSaldo(saldoRes.data);
    } catch (err) {
      let texto = "❌ Error inesperado al intentar agregar gasto.";
      if (err.response?.data?.mensaje) {
        texto = err.response.data.mensaje;
        if (err.response.data.saldoRestante !== undefined) {
          texto += ` (Saldo disponible: $${Number(
            err.response.data.saldoRestante
          ).toLocaleString("es-CL")})`;
        }
      }
      setMensaje({ tipo: "error", texto });
    }
  };

  // 🔹 Eliminar gasto
  const handleDeleteGasto = async (id) => {
    try {
      await API.delete(`/gastos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGastos(gastos.filter((g) => g.id !== id));

      const saldoRes = await API.get("/presupuesto/saldo");
      setSaldo(saldoRes.data);
      setMensaje({ tipo: "info", texto: "🗑️ Gasto eliminado correctamente." });
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: "❌ Error al intentar eliminar gasto.",
      });
    }
  };

  const handleOpenEdit = (gasto) => {
    setGastoEdit(gasto);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setGastoEdit(null);
  };

  // 🔹 Guardar cambios en edición
  const handleUpdateGasto = async () => {
    if (!gastoEdit.descripcion || !gastoEdit.monto || !gastoEdit.categoria_id) {
      setMensaje({ tipo: "error", texto: "⚠️ Todos los campos son obligatorios." });
      return;
    }

    try {
      const res = await API.put(
        `/gastos/${gastoEdit.id}`,
        {
          descripcion: gastoEdit.descripcion,
          monto: gastoEdit.monto,
          categoria_id: Number(gastoEdit.categoria_id),
          fecha: new Date().toISOString().split("T")[0],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGastos(
        gastos.map((g) => (g.id === gastoEdit.id ? res.data.gasto : g))
      );
      handleCloseEdit();

      const saldoRes = await API.get("/presupuesto/saldo");
      setSaldo(saldoRes.data);

      setMensaje({ tipo: "success", texto: "✏️ Gasto actualizado correctamente." });
    } catch (err) {
      const texto =
        err.response?.data?.mensaje ||
        "❌ Error inesperado al intentar actualizar gasto.";
      setMensaje({ tipo: "error", texto });
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        {categoriaNombre
          ? `Gastos de ${categoriaNombre}`
          : "Gestionar Gastos"}
      </Typography>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      {/* Formulario para agregar gasto */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descripción"
            fullWidth
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={saldo && saldo.saldoRestante <= 0}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Monto"
            type="number"
            fullWidth
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            disabled={saldo && saldo.saldoRestante <= 0}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            select
            label="Categoría"
            fullWidth
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            disabled={saldo && saldo.saldoRestante <= 0}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGasto}
            disabled={saldo && saldo.saldoRestante <= 0}
          >
            Agregar Gasto
          </Button>
        </Grid>
      </Grid>

      {/* Lista de gastos */}
      <Grid container spacing={3}>
        {gastos.map((gasto) => (
          <Grid item xs={12} sm={6} md={4} key={gasto.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{gasto.descripcion}</Typography>
                <Typography variant="body2" color="text.secondary">
                  💰 Monto: ${Number(gasto.monto).toLocaleString("es-CL")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📂 Categoría: {gasto.categoria_nombre}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleOpenEdit(gasto)}>
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteGasto(gasto.id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal de edición */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Editar Gasto</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={gastoEdit?.descripcion || ""}
            onChange={(e) =>
              setGastoEdit({ ...gastoEdit, descripcion: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Monto"
            type="number"
            fullWidth
            value={gastoEdit?.monto || ""}
            onChange={(e) =>
              setGastoEdit({ ...gastoEdit, monto: e.target.value })
            }
          />
          <TextField
            select
            margin="dense"
            label="Categoría"
            fullWidth
            value={gastoEdit?.categoria_id || ""}
            onChange={(e) =>
              setGastoEdit({
                ...gastoEdit,
                categoria_id: Number(e.target.value),
              })
            }
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateGasto}
            variant="contained"
            color="primary"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Gastos;
