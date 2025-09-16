// src/pages/Categorias.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoriaService";
import { useNavigate } from "react-router-dom";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔹 Obtener categorías reales al cargar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (err) {
        setError("Error al cargar categorías");
      }
    };
    fetchCategorias();
  }, []);

  // 🔹 Abrir/Cerrar modal
  const handleOpen = (categoria = null) => {
    setEditando(categoria);
    setNuevaCategoria(categoria ? categoria.nombre : "");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setNuevaCategoria("");
    setEditando(null);
  };

  // 🔹 Crear o editar categoría
  const handleSaveCategoria = async () => {
    if (nuevaCategoria.trim() === "") return;

    try {
      if (editando) {
        // editar
        const updated = await updateCategoria(editando.id, nuevaCategoria);
        setCategorias(
          categorias.map((cat) => (cat.id === updated.id ? updated : cat))
        );
      } else {
        // crear
        const nueva = await createCategoria(nuevaCategoria);
        setCategorias([nueva, ...categorias]);
      }
      handleClose();
    } catch (err) {
      setError("Error al guardar categoría");
    }
  };

  // 🔹 Eliminar categoría
  const handleDeleteCategoria = async (id) => {
    try {
      await deleteCategoria(id);
      setCategorias(categorias.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Error al eliminar categoría");
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Categorías
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => handleOpen()}
      >
        Agregar Categoría
      </Button>

      <Grid container spacing={3}>
        {categorias.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card
              sx={{ boxShadow: 3, cursor: "pointer" }}
              onClick={() => navigate("/gastos", { state: { categoriaId: cat.id } })}
            >
              <CardContent>
                <Typography variant="h6">{cat.nombre}</Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // 👈 evita que dispare el navigate
                    handleOpen(cat);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation(); // 👈 evita que dispare el navigate
                    handleDeleteCategoria(cat.id);
                  }}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para crear/editar categoría */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editando ? "Editar Categoría" : "Agregar Nueva Categoría"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Categoría"
            fullWidth
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveCategoria}
            variant="contained"
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Categorias;
