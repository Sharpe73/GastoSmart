// src/pages/Gastos.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { AttachFile } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api";
import GastosList from "./GastosList";

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [saldo, setSaldo] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [gastoEdit, setGastoEdit] = useState(null);
  const [archivoEdit, setArchivoEdit] = useState(null);

  const token = localStorage.getItem("token");
  const location = useLocation();
  const categoriaSeleccionada = location.state?.categoriaId || "";
  const [categoriaNombre, setCategoriaNombre] = useState("");

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

  // 🔹 Descargar y abrir PDF
  const handleVerDocumento = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/gastos/${id}/archivo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Error al descargar el archivo");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "❌ No se pudo abrir el documento.",
      });
    }
  };

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
      const formData = new FormData();
      formData.append("usuario_id", decoded.id);
      formData.append("descripcion", descripcion);
      formData.append("monto", monto);
      formData.append("categoria_id", categoriaId);
      if (archivo) {
        formData.append("archivo", archivo);
      }

      const res = await API.post("/gastos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setGastos([res.data.gasto, ...gastos]);
      setDescripcion("");
      setMonto("");
      setCategoriaId(categoriaSeleccionada ? Number(categoriaSeleccionada) : "");
      setArchivo(null);
      setMensaje({ tipo: "success", texto: "✅ Gasto agregado correctamente." });

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
    setArchivoEdit(null);
  };

  // 🔹 Guardar cambios en edición
  const handleUpdateGasto = async () => {
    if (!gastoEdit.descripcion || !gastoEdit.monto || !gastoEdit.categoria_id) {
      setMensaje({ tipo: "error", texto: "⚠️ Todos los campos son obligatorios." });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("descripcion", gastoEdit.descripcion);
      formData.append("monto", gastoEdit.monto);
      formData.append("categoria_id", gastoEdit.categoria_id);
      if (archivoEdit) {
        formData.append("archivo", archivoEdit);
      }

      const res = await API.put(`/gastos/${gastoEdit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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
        {categoriaNombre ? `Gastos de ${categoriaNombre}` : "Gestionar Gastos"}
      </Typography>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      {/* Formulario para agregar gasto */}
      <Grid container spacing={2}>
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

        {/* Botones en la misma fila */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddGasto}
              disabled={saldo && saldo.saldoRestante <= 0}
              sx={{ height: 40 }}
            >
              Agregar Gasto
            </Button>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFile />}
              disabled={saldo && saldo.saldoRestante <= 0}
              sx={{ height: 40 }}
            >
              Adjuntar documento
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) => setArchivo(e.target.files[0])}
              />
            </Button>
          </Box>
          {archivo && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📎 {archivo.name}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Lista de gastos con paginación */}
      <Box sx={{ mt: 2 }}>
        <GastosList
          gastos={gastos}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteGasto}
          onVerDocumento={handleVerDocumento}
        />
      </Box>

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
          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachFile />}
            sx={{ mt: 2 }}
          >
            Cambiar documento
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => setArchivoEdit(e.target.files[0])}
            />
          </Button>
          {archivoEdit && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📎 {archivoEdit.name}
            </Typography>
          )}
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
